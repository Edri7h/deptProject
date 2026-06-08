import {pgTable,uuid,text} from "drizzle-orm/pg-core";

import {user} from "./user.js"
import {project} from "./project.js";

export const team =pgTable("team",{
    id:uuid("id").primaryKey().defaultRandom(),
    teamName:text("team_name").notNull(),
    leaderId:uuid("leader_id").references(()=>user.id).notNull(),
    projectId:uuid("project_id").references(()=>project.id).unique(),
    mentorId:uuid("mentor_id").references(()=>user.id)
})

