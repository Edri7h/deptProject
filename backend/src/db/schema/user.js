import { pgTable, serial, text ,uuid,boolean} from "drizzle-orm/pg-core";

import {roleEnum,deptEnum} from "../enum.js";

export const user=pgTable("user",{
    id:uuid("id").primaryKey().defaultRandom(),
    name:text("name").notNull(),
    email:text("email").notNull().unique(),
    password:text("password").notNull(),
    dept:deptEnum("dept").notNull(),
    rollNo:text("roll_No").unique(),
    role:roleEnum("role").notNull(),
    isActive: boolean("is_active").default(true)
})

