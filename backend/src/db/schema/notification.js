import {
  pgTable,
  uuid,
  text,
  boolean,
  pgEnum,
  timestamp
} from "drizzle-orm/pg-core";

import { user } from "./user.js";
import { request } from "./request.js";

export const notificationTypeEnum = pgEnum(
  "notification_type",
  [
    "TEAM_INVITE",
    "INVITE_ACCEPTED",
    "INVITE_REJECTED",
    "MENTOR_REQUEST",
    "MENTOR_ACCEPTED",
    "MENTOR_REJECTED"
  ]
);

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),

  notificationType: notificationTypeEnum("notification_type")
    .notNull(),

  receiverId: uuid("receiver_id")
    .notNull()
    .references(() => user.id),

  senderId: uuid("sender_id")
    .references(() => user.id),

  requestId: uuid("request_id").references(() => request.id),


  message: text("message")
    .notNull(),

  isRead: boolean("is_read")
    .notNull()
    .default(false),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});

