import { and, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import jwtService from "../../utils/jwt.js";
import { user } from "../../db/schema/user.js";
import { teamMembers } from "../../db/schema/teamMembers.js";
import { team } from "../../db/schema/team.js";
import { request } from "../../db/schema/request.js";
class AuthService {

    async login(email, password) {

        
            const existingUser = await db.query.user.findFirst({
                where: eq(user.email, email),
                 columns: {
                id: true,
                name: true,
                dept: true,
                email: true,
                role: true,
                rollNo:true,
                password:true
            }
            })

            if (!existingUser) {
                throw new Error("Invalid credentials");
            }
            if (existingUser.password !== password) {
                throw new Error("Invalid credentials");
            }

            const token = jwtService.generateToken({
                id: existingUser.id,
                email: existingUser.email,
                role: existingUser.role,
                dept: existingUser.dept,
                name: existingUser.name
            });
            const { password: _, ...safeUser } = existingUser;

            return {
                data: safeUser,
                token

            };
        


    }


    async getDashboardData(userId) {

        // get user details
        const existingUser = await db.query.user.findFirst({
            where: eq(user.id, userId),
            columns: {
                id: true,
                name: true,
                dept: true,
                email: true,
                role: true,
                rollNo:true
            }
        });

        if (!existingUser) {
            throw new Error("User not found");
        }
        let details = {
            user: existingUser,
            isMember: false,
            memberDetails: [],
            team: null
        };

        // is member of team



        const membership = await db.query.teamMembers.findFirst({ where: eq(teamMembers.userId, userId) });


        if (membership) {
            const teamMemberDetails = await db.query.teamMembers.findMany({
                where: eq(teamMembers.teamId, membership.teamId),
                with: {
                    user: true
                }


            });

            details.memberDetails = teamMemberDetails;//[]
            details.isMember = true;


            const teamDetails = await db.query.team.findFirst({
                where: eq(team.id, membership.teamId),
                with: {
                    project: true,
                    mentor: true,
                    leader: true

                }
            })

            if (teamDetails) {
                details.team = teamDetails;
            }


        }









        return details;
    }

    async getProfessorDashboardData(userId) {
        const existingUser = await db.query.user.findFirst({
            where: eq(user.id, userId),
            columns: {
                id: true,
                name: true,
                dept: true,
                email: true,
                role: true,
            }
        });

        if (!existingUser) {
            throw new Error("User not found");
        }

        const mentoredTeams = await db.query.team.findMany({
            where: eq(team.mentorId, userId),
            with: {
                project: true,
                leader: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                        rollNo: true
                    }
                },
                members: {
                    with: {
                        user: {
                            columns: {
                                id: true,
                                name: true,
                                email: true,
                                rollNo: true
                            }
                        }
                    }
                }
            }
        });

        const pendingRequests = await db.query.request.findMany({
            where: and(
                eq(request.receiverId, userId),
                eq(request.type, "MENTOR_REQUEST"),
                eq(request.status, "pending")
            ),
            with: {
                team: {
                    with: {
                        project: true,
                        leader: {
                            columns: {
                                id: true,
                                name: true,
                                email: true,
                                rollNo: true
                            }
                        },
                        members: {
                            with: {
                                user: {
                                    columns: {
                                        id: true,
                                        name: true,
                                        email: true,
                                        rollNo: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        const activeStudents = mentoredTeams.reduce((total, item) => {
            return total + (item.members?.length || 0);
        }, 0);

        return {
            user: existingUser,
            pendingRequests,
            mentoredTeams,
            stats: {
                pendingRequests: pendingRequests.length,
                activeStudents,
                supervisedProjects: mentoredTeams.length
            }
        };
    }


}

export default new AuthService();

