import {pgTable,uuid,text,boolean} from "drizzle-orm/pg-core";
import {user} from "./user.js"
import {team} from "./team.js"

export const teamMembers=pgTable("team_members",{
    id:uuid("id").primaryKey().defaultRandom(),
    teamId:uuid("team_id").references(()=>team.id).notNull(),
    userId:uuid("user_id").references(()=>user.id).notNull().unique(),
})


