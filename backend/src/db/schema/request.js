

import  { pgTable, uuid, text, boolean ,pgEnum,timestamp} from "drizzle-orm/pg-core";
import {user} from "./user.js";
import {team} from "./team.js";
import {inviteStatusEnum} from "../enum.js";


export const requestTypeEnum = pgEnum("request_type", [
  "TEAM_INVITE",
  "MENTOR_REQUEST"
]);

export const request = pgTable("request", {
  id: uuid("id").primaryKey().defaultRandom(),

  type: requestTypeEnum("type").notNull(),

  senderId: uuid("sender_id")
    .notNull()
    .references(() => user.id),

  receiverId: uuid("receiver_id")
    .notNull()
    .references(() => user.id),

  teamId: uuid("team_id")
    .notNull()
    .references(() => team.id),

  status: inviteStatusEnum("status")
    .notNull()
    .default("pending"),

  createdAt: timestamp("created_at")
   .defaultNow()
   .notNull()
});