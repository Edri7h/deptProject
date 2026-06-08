import { db } from "../../db/index.js";

import { user } from "../../db/schema/user.js";
import { team } from "../../db/schema/team.js";
import { request } from "../../db/schema/request.js";
import { notifications } from "../../db/schema/notification.js";

import {
    eq,
    and,
    or,
    ne,
    ilike
} from "drizzle-orm";

class MentorService {

    async searchProfessor(searchText, myDept) {
        const searchValue = searchText?.trim();

        if (!searchValue) {
            return [];
        }

        return await db
            .select({
                id: user.id,
                name: user.name,
                email: user.email,
                dept: user.dept
            })
            .from(user)
            .where(
                and(
                    eq(user.role, "professor"),
                    eq(user.dept, myDept),
                    or(
                        ilike(user.name, `%${searchValue}%`),
                        ilike(user.email, `%${searchValue}%`)
                    )
                )
            )
            .limit(10);
    }

    async sendMentorRequest(reqObj) {

        const {
            senderId,
            professorId,
            teamId
        } = reqObj;

        const existingTeam =
            await db.query.team.findFirst({
                where: eq(team.id, teamId)
            });

        if (!existingTeam) {
            throw new Error("Team not found");
        }

        if (existingTeam.leaderId !== senderId) {
            throw new Error(
                "Only team leader can send mentor requests"
            );
        }

        if (existingTeam.mentorId) {
            throw new Error(
                "Team already has a mentor"
            );
        }

        const professor =
            await db.query.user.findFirst({
                where: and(
                    eq(user.id, professorId),
                    eq(user.role, "professor")
                )
            });

        if (!professor) {
            throw new Error(
                "Professor not found"
            );
        }

        const activeTeams =
            await db.select()
                .from(team)
                .where(
                    eq(
                        team.mentorId,
                        professorId
                    )
                );

        if (activeTeams.length >= 3) {
            throw new Error(
                "Professor has reached mentorship limit"
            );
        }

        const existingRequest =
            await db.query.request.findFirst({
                where: and(
                    eq(request.teamId, teamId),
                    eq(request.receiverId, professorId),
                    eq(request.type, "MENTOR_REQUEST"),
                    eq(request.status, "pending")
                )
            });

        if (existingRequest) {
            throw new Error(
                "Request already sent"
            );
        }

        return await db.transaction(async (tx) => {

            const [newRequest] =
                await tx.insert(request)
                    .values({
                        type: "MENTOR_REQUEST",
                        senderId,
                        receiverId: professorId,
                        teamId
                    })
                    .returning();

            const [notification] =
                await tx.insert(notifications)
                    .values({
                        notificationType:
                            "MENTOR_REQUEST",

                        senderId,

                        receiverId: professorId,

                        requestId:
                            newRequest.id,

                        message:
                            "You have received a mentorship request"
                    })
                    .returning();

            return {
                request: newRequest,
                notification
            };
        });
    }

    async getSentMentorRequests(userId) {

        const leaderTeam =
            await db.query.team.findFirst({
                where: eq(
                    team.leaderId,
                    userId
                )
            });

        if (!leaderTeam) {
            throw new Error(
                "Only team leader can access requests"
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
                    "MENTOR_REQUEST"
                )
            ),

            with: {

                receiver: {
                    columns: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
    }

    async cancelMentorRequest(
        userId,
        requestId
    ) {

        const mentorRequest =
            await db.query.request.findFirst({

                where: and(
                    eq(
                        request.id,
                        requestId
                    ),
                    eq(
                        request.type,
                        "MENTOR_REQUEST"
                    )
                )
            });

        if (!mentorRequest) {
            throw new Error(
                "Request not found"
            );
        }

        const existingTeam =
            await db.query.team.findFirst({

                where: eq(
                    team.id,
                    mentorRequest.teamId
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
                "Only team leader can cancel request"
            );
        }

        if (
            mentorRequest.status !== "pending"
        ) {
            throw new Error(
                "Request already processed"
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

        return "Mentor request cancelled successfully";
    }

    async getMentorRequests(professorId) {

        return await db.query.request.findMany({

            where: and(
                eq(
                    request.receiverId,
                    professorId
                ),
                eq(
                    request.type,
                    "MENTOR_REQUEST"
                ),
                eq(
                    request.status,
                    "pending"
                )
            ),

            with: {

                sender: {
                    columns: {
                        id: true,
                        name: true,
                        email: true
                    }
                },

                team: {
                    with: {
                        project: true,
                        leader: {
                            columns: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });
    }

    async acceptMentorRequest(reqObj) {

        const {
            professorId,
            requestId,
            notificationId
        } = reqObj;

        return await db.transaction(async (tx) => {

            const mentorRequest =
                await tx.query.request.findFirst({

                    where: and(
                        eq(request.id, requestId),
                        eq(request.receiverId, professorId),
                        eq(request.type, "MENTOR_REQUEST"),
                        eq(request.status, "pending")
                    )
                });

            if (!mentorRequest) {
                throw new Error(
                    "Request expired"
                );
            }

            const teamData =
                await tx.query.team.findFirst({
                    where: eq(
                        team.id,
                        mentorRequest.teamId
                    )
                });

            if (!teamData) {
                throw new Error(
                    "Team not found"
                );
            }

            if (teamData.mentorId) {
                throw new Error(
                    "Team already assigned a mentor"
                );
            }

            const activeTeams =
                await tx.select()
                    .from(team)
                    .where(
                        eq(
                            team.mentorId,
                            professorId
                        )
                    );

            if (activeTeams.length >= 3) {
                throw new Error(
                    "Mentorship capacity reached"
                );
            }

            await tx.update(team)
                .set({
                    mentorId: professorId
                })
                .where(
                    eq(
                        team.id,
                        mentorRequest.teamId
                    )
                );

            await tx.update(request)
                .set({
                    status: "accepted"
                })
                .where(
                    eq(
                        request.id,
                        requestId
                    )
                );

            if (notificationId) {
                await tx.update(notifications)
                    .set({
                        isRead: true
                    })
                    .where(
                        eq(
                            notifications.id,
                            notificationId
                        )
                    );
            }

            await tx.update(request)
                .set({
                    status: "rejected"
                })
                .where(
                    and(
                        eq(
                            request.teamId,
                            mentorRequest.teamId
                        ),
                        eq(
                            request.type,
                            "MENTOR_REQUEST"
                        ),
                        eq(
                            request.status,
                            "pending"
                        ),
                        ne(
                            request.id,
                            requestId
                        )
                    )
                );

            return "Mentorship request accepted";
        });
    }

    async rejectMentorRequest(reqObj) {

        const {
            professorId,
            requestId,
            notificationId
        } = reqObj;

        return await db.transaction(async (tx) => {

            const mentorRequest =
                await tx.query.request.findFirst({

                    where: and(
                        eq(
                            request.id,
                            requestId
                        ),
                        eq(
                            request.receiverId,
                            professorId
                        ),
                        eq(
                            request.type,
                            "MENTOR_REQUEST"
                        ),
                        eq(
                            request.status,
                            "pending"
                        )
                    )
                });

            if (!mentorRequest) {
                throw new Error(
                    "Request expired"
                );
            }

            await tx.update(request)
                .set({
                    status: "rejected"
                })
                .where(
                    eq(
                        request.id,
                        requestId
                    )
                );

            if (notificationId) {
                await tx.update(notifications)
                    .set({
                        isRead: true
                    })
                    .where(
                        eq(
                            notifications.id,
                            notificationId
                        )
                    );
            }

            return "Mentorship request rejected";
        });
    }
}

export default new MentorService();
