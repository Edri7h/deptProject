import { team } from "../../db/schema/team.js";
import { teamMembers } from "../../db/schema/teamMembers.js";
import { user } from "../../db/schema/user.js";
import { db } from "../../db/index.js";
import { request } from "../../db/schema/request.js";
import { notifications } from "../../db/schema/notification.js";
import { project } from "../../db/schema/project.js";
import RealtimeService from "../realtime/realtime.service.js";

import {
    eq,
    and,
    or,
    ne,
    ilike,
    notInArray
} from "drizzle-orm";

class TeamService {

    async createTeam(teamData) {

        const existingMembership =
            await db.query.teamMembers.findFirst({
                where: eq(
                    teamMembers.userId,
                    teamData.leaderId
                ),
                
            
            
            });

        if (existingMembership) {
            throw new Error(
                "User already belongs to a team"
            );
        }

        const selectedProject =
            await db.query.project.findFirst({
                where: and(
                    eq(project.id, teamData.projectId),
                    eq(project.isAssigned, false)
                )
            });

        if (!selectedProject) {
            throw new Error(
                "Project unavailable"
            );
        }

        return await db.transaction(async (tx) => {

            const [newTeam] =
                await tx.insert(team)
                    .values({
                        teamName: teamData.teamName,
                        leaderId: teamData.leaderId,
                        projectId: teamData.projectId
                    })
                    .returning();

            await tx.insert(teamMembers)
                .values({
                    teamId: newTeam.id,
                    userId: teamData.leaderId
                });

            await tx.update(project)
                .set({
                    isAssigned: true
                })
                .where(
                    eq(
                        project.id,
                        teamData.projectId
                    )
                );

            return newTeam;
        });
    }

    async searchStudent(
        studentInfo,
        myDept,
        myUserId
    ) {
        const searchText = studentInfo?.trim();

        if (!searchText) {
            return [];
        }

        const existingMembers =
            await db
                .select({
                    userId: teamMembers.userId
                })
                .from(teamMembers);

        const memberIds =
            existingMembers
                .map((member) => member.userId)
                .filter(Boolean);

        const conditions = [
            eq(user.role, "student"),
            eq(user.dept, myDept),
            ne(user.id, myUserId),
            or(
                ilike(user.rollNo, `%${searchText}%`),
                ilike(user.name, `%${searchText}%`),
                ilike(user.email, `%${searchText}%`)
            )
        ];

        if (memberIds.length > 0) {
            conditions.push(notInArray(user.id, memberIds));
        }

        const students =
            await db
                .select({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    rollNo: user.rollNo,
                    dept: user.dept
                })
                .from(user)
                .where(and(...conditions))
                .limit(10);

        return students;
    }

    async sendTeamInvite(inviteObj) {

        const {
            senderId,
            receiverId,
            teamId,
            senderName
        } = inviteObj;

        if (senderId === receiverId) {
            throw new Error(
                "Cannot invite yourself"
            );
        }

        const existingTeam =
            await db.query.team.findFirst({
                where: eq(team.id, teamId)
            });

        if (!existingTeam) {
            throw new Error("Team not found");
        }

        if (
            existingTeam.leaderId !== senderId
        ) {
            throw new Error(
                "Only leader can invite students"
            );
        }

        const alreadyMember =
            await db.query.teamMembers.findFirst({
                where: eq(
                    teamMembers.userId,
                    receiverId
                )
            });

        if (alreadyMember) {
            throw new Error(
                "Student already belongs to a team"
            );
        }

        const teamSize =
            await db.select()
                .from(teamMembers)
                .where(
                    eq(
                        teamMembers.teamId,
                        teamId
                    )
                );

        if (teamSize.length >= 4) {
            throw new Error(
                "Team is already full"
            );
        }

        const existingInvite =
            await db.query.request.findFirst({
                where: and(
                    eq(
                        request.teamId,
                        teamId
                    ),
                    eq(
                        request.receiverId,
                        receiverId
                    ),
                    eq(
                        request.type,
                        "TEAM_INVITE"
                    ),
                    eq(
                        request.status,
                        "pending"
                    )
                )
            });

        if (existingInvite) {
            throw new Error(
                "Invite already sent"
            );
        }

        return await db.transaction(async (tx) => {

            const [newRequest] =
                await tx.insert(request)
                    .values({
                        type: "TEAM_INVITE",
                        senderId,
                        receiverId,
                        teamId
                    })
                    .returning();

            const [notification] =
                await tx.insert(notifications)
                    .values({
                        notificationType:
                            "TEAM_INVITE",

                        senderId,

                        receiverId,

                        requestId:
                            newRequest.id,

                        message:
                            `${senderName} invited you to join ${existingTeam.teamName}`
                    })
                    .returning();

            RealtimeService.emitToUser(
                receiverId,
                "teamInviteReceived",
                notification
            );        

            return {
                request: newRequest,
                notification
            };
        });
    }

    async getMyTeam(userId) {

        const membership =
            await db.query.teamMembers.findFirst({

                where: eq(
                    teamMembers.userId,
                    userId
                ),

                with: {
                    team: {
                        with: {

                            leader: {
                                columns: {
                                    id: true,
                                    name: true,
                                    email: true
                                }
                            },

                            project: true,

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

        if (!membership) {
            throw new Error(
                "User does not belong to any team"
            );
        }

        return membership.team;
    }

    async getSentInvites(userId) {

        const leaderTeam =
            await db.query.team.findFirst({
                where: eq(
                    team.leaderId,
                    userId
                )
            });

        if (!leaderTeam) {
            throw new Error(
                "Only team leader can view invites"
            );
        }

        return await db.query.request.findMany({

            where: and(
                eq(
                    request.teamId,
                    leaderTeam.id
                ),
                eq(
                    request.type,
                    "TEAM_INVITE"
                )
            ),

            with: {

                receiver: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                        rollNo: true
                    }
                }
            }
        });
    }

    async cancelInvite(
        userId,
        requestId
    ) {

        const invite =
            await db.query.request.findFirst({

                where: and(
                    eq(
                        request.id,
                        requestId
                    ),
                    eq(
                        request.type,
                        "TEAM_INVITE"
                    )
                )
            });

        if (!invite) {
            throw new Error(
                "Invite not found"
            );
        }

        const existingTeam =
            await db.query.team.findFirst({

                where: eq(
                    team.id,
                    invite.teamId
                )
            });

        if (!existingTeam) {
            throw new Error(
                "Team not found"
            );
        }

        if (
            existingTeam.leaderId !== userId
        ) {
            throw new Error(
                "Only leader can cancel invite"
            );
        }

        if (
            invite.status !== "pending"
        ) {
            throw new Error(
                "Invite already processed"
            );
        }

        await db.transaction(async (tx) => {

            await tx.delete(notifications)
                .where(
                    eq(
                        notifications.requestId,
                        requestId
                    )
                );

            await tx.delete(request)
                .where(
                    eq(
                        request.id,
                        requestId
                    )
                );
        });

        return "Invite cancelled successfully";
    }
    
}

export default new TeamService();
