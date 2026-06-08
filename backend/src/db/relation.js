// import { relations } from "drizzle-orm";

// import { user } from "./schema/user.js";
// import { team } from "./schema/team.js";
// import { project } from "./schema/project.js";
// import { teamMembers } from "./schema/teamMembers.js";
// import { studentInvite } from "./schema/request.js";
// import { mentorshipRequest } from "./schema/mentorshipRequest.js";
// import { notifications } from "./schema/notification.js";

// /* ===========================
//    USER RELATIONS
// =========================== */

// export const userRelations = relations(user, ({ many }) => ({
//   ledTeams: many(team),
//   notifications: many(notifications),

//   teamMemberships: many(teamMembers),

//   sentInvites: many(studentInvite, {
//     relationName: "invite_sender",
//   }),

//   receivedInvites: many(studentInvite, {
//     relationName: "invite_receiver",
//   }),

//   mentorRequests: many(mentorshipRequest),

//   notifications: many(notifications),
// }));

// /* ===========================
//    TEAM RELATIONS
// =========================== */

// export const teamRelations = relations(team, ({ one, many }) => ({
//   leader: one(user, {
//     fields: [team.leaderId],
//     references: [user.id],
//   }),

//   project: one(project, {
//     fields: [team.projectId],
//     references: [project.id],
//   }),

//   mentor: one(user, {
//     fields: [team.mentorId],
//     references: [user.id],
//   }),

//   members: many(teamMembers),

//   invites: many(studentInvite),

//   mentorRequests: many(mentorshipRequest),
// }));

// /* ===========================
//    PROJECT RELATIONS
// =========================== */

// export const projectRelations = relations(project, ({ many }) => ({
//   teams: many(team),
// }));

// /* ===========================
//    TEAM MEMBERS RELATIONS
// =========================== */

// export const teamMembersRelations = relations(
//   teamMembers,
//   ({ one }) => ({
//     team: one(team, {
//       fields: [teamMembers.teamId],
//       references: [team.id],
//     }),

//     user: one(user, {
//       fields: [teamMembers.userId],
//       references: [user.id],
//     }),
//   })
// );

// /* ===========================
//    STUDENT INVITE RELATIONS
// =========================== */

// export const studentInviteRelations = relations(
//   studentInvite,
//   ({ one }) => ({
//     sender: one(user, {
//       relationName: "invite_sender",
//       fields: [studentInvite.senderId],
//       references: [user.id],
//     }),

//     receiver: one(user, {
//       relationName: "invite_receiver",
//       fields: [studentInvite.receiverId],
//       references: [user.id],
//     }),

//     team: one(team, {
//       fields: [studentInvite.teamId],
//       references: [team.id],
//     }),
//   })
// );

// /* ===========================
//    MENTORSHIP REQUEST RELATIONS
// =========================== */

// export const mentorshipRequestRelations = relations(
//   mentorshipRequest,
//   ({ one }) => ({
//     team: one(team, {
//       fields: [mentorshipRequest.teamId],
//       references: [team.id],
//     }),

//     professor: one(user, {
//       fields: [mentorshipRequest.professorId],
//       references: [user.id],
//     }),
//   })
// );

// /* ===========================
//    NOTIFICATION RELATIONS
// =========================== */

// export const notificationRelations = relations(
//   notifications,
//   ({ one }) => ({
//     sender: one(user, {
//       relationName: "notification_sender",
//       fields: [notifications.senderId],
//       references: [user.id],
//     }),

//     receiver: one(user, {
//       relationName: "notification_receiver",
//       fields: [notifications.receiverId],
//       references: [user.id],
//     }),

//      invite: one(studentInvite, {
//       fields: [notifications.inviteId],
//       references: [studentInvite.id],
//     }),
//   })
// );



import { relations } from "drizzle-orm";

import { user } from "./schema/user.js";
import { team } from "./schema/team.js";
import { project } from "./schema/project.js";
import { teamMembers } from "./schema/teamMembers.js";
import { request } from "./schema/request.js";
import { notifications } from "./schema/notification.js";

/* ===========================
   USER RELATIONS
=========================== */

export const userRelations = relations(user, ({ many }) => ({

  ledTeams: many(team),

  teamMemberships: many(teamMembers),

  sentRequests: many(request, {
    relationName: "request_sender",
  }),

  receivedRequests: many(request, {
    relationName: "request_receiver",
  }),

  sentNotifications: many(notifications, {
    relationName: "notification_sender",
  }),

  receivedNotifications: many(notifications, {
    relationName: "notification_receiver",
  }),
}));

/* ===========================
   TEAM RELATIONS
=========================== */
export const teamRelations = relations(team, ({ one, many }) => ({

  leader: one(user, {
    relationName: "team_leader",
    fields: [team.leaderId],
    references: [user.id],
  }),

  mentor: one(user, {
    relationName: "team_mentor",
    fields: [team.mentorId],
    references: [user.id],
  }),

  project: one(project, {
    fields: [team.projectId],
    references: [project.id],
  }),

  members: many(teamMembers),

  requests: many(request),
}));

/* ===========================
   PROJECT RELATIONS
=========================== */

export const projectRelations = relations(project, ({ many }) => ({
  teams: many(team),
}));

/* ===========================
   TEAM MEMBERS RELATIONS
=========================== */

export const teamMembersRelations = relations(
  teamMembers,
  ({ one }) => ({

    team: one(team, {
      fields: [teamMembers.teamId],
      references: [team.id],
    }),

    user: one(user, {
      fields: [teamMembers.userId],
      references: [user.id],
    }),
  })
);

/* ===========================
   REQUEST RELATIONS
=========================== */

export const requestRelations = relations(
  request,
  ({ one }) => ({

    sender: one(user, {
      relationName: "request_sender",
      fields: [request.senderId],
      references: [user.id],
    }),

    receiver: one(user, {
      relationName: "request_receiver",
      fields: [request.receiverId],
      references: [user.id],
    }),

    team: one(team, {
      fields: [request.teamId],
      references: [team.id],
    }),
  })
);

/* ===========================
   NOTIFICATION RELATIONS
=========================== */

export const notificationRelations = relations(
  notifications,
  ({ one }) => ({

    sender: one(user, {
      relationName: "notification_sender",
      fields: [notifications.senderId],
      references: [user.id],
    }),

    receiver: one(user, {
      relationName: "notification_receiver",
      fields: [notifications.receiverId],
      references: [user.id],
    }),

    request: one(request, {
      fields: [notifications.requestId],
      references: [request.id],
    }),
  })
);