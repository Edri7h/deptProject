import { db } from "../../db/index.js";

import { user } from "../../db/schema/user.js";
import { team } from "../../db/schema/team.js";
import { teamMembers } from "../../db/schema/teamMembers.js";
import { request } from "../../db/schema/request.js";
import { notifications } from "../../db/schema/notification.js";

import {
    eq,
    and,
    or,
    ne
} from "drizzle-orm";

class UserService {



    async acceptTeamInvite(reqObj) {

        const {
            userId,
            requestId,
            notificationId
        } = reqObj;

        return await db.transaction(async (tx) => {

            const receivedRequest =
                await tx.query.request.findFirst({
                    where: and(
                        eq(request.id, requestId),
                        eq(request.receiverId, userId),
                        eq(request.status, "pending"),
                        eq(request.type, "TEAM_INVITE")
                    )
                });

            if (!receivedRequest) {
                throw new Error("Invite expired");
            }

            const alreadyMember =
                await tx.query.teamMembers.findFirst({
                    where: eq(teamMembers.userId, userId)
                });

            if (alreadyMember) {
                throw new Error("Already part of a team");
            }

            const currentMembers =
                await tx.select()
                    .from(teamMembers)
                    .where(
                        eq(
                            teamMembers.teamId,
                            receivedRequest.teamId
                        )
                    );

            if (currentMembers.length >= 4) {
                throw new Error("Team is already full");
            }

            await tx.insert(teamMembers).values({
                teamId: receivedRequest.teamId,
                userId
            });

            await tx.update(request)
                .set({
                    status: "accepted"
                })
                .where(eq(request.id, requestId));

            await tx.update(notifications)
                .set({
                    isRead: true
                })
                .where(eq(notifications.id, notificationId));

            await tx.update(request)
                .set({
                    status: "rejected"
                })
                .where(
                    and(
                        eq(request.receiverId, userId),
                        eq(request.status, "pending"),
                        eq(request.type, "TEAM_INVITE"),
                        ne(request.id, requestId)
                    )
                );

            return "Invite accepted successfully";
        });
    }

    async rejectTeamInvite(reqObj) {

        const {
            userId,
            requestId,
            notificationId
        } = reqObj;

        return await db.transaction(async (tx) => {

            const receivedRequest =
                await tx.query.request.findFirst({
                    where: and(
                        eq(request.id, requestId),
                        eq(request.receiverId, userId),
                        eq(request.status, "pending"),
                        eq(request.type, "TEAM_INVITE")
                    )
                });

            if (!receivedRequest) {
                throw new Error("Invite expired");
            }

            await tx.update(request)
                .set({
                    status: "rejected"
                })
                .where(eq(request.id, requestId));

            await tx.update(notifications)
                .set({
                    isRead: true
                })
                .where(eq(notifications.id, notificationId));

            return "Invite rejected successfully";
        });
    }
    
    async getNotifications(userId) {

        return await db.query.notifications.findMany({
            where: and(
                eq(notifications.receiverId, userId),
                eq(notifications.isRead, false)
            ),

            with: {

                sender: {
                    columns: {
                        id: true,
                        name: true,
                        email: true
                    }
                },

                request: {

                    with: {

                        team: {

                            with: {
                                project: true
                            }
                        }
                    }
                }
            },

            orderBy: (notifications, { desc }) => [
                desc(notifications.createdAt)
            ]
        });
    }
}

export default new UserService();
