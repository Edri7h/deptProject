import { pgEnum } from "drizzle-orm/pg-core";
export const deptEnum=pgEnum("deptEnum",["CSE","IT"]);

export const roleEnum=pgEnum("roleEnum",["student","professor"]);



export const inviteStatusEnum=pgEnum("inviteStatusEnum",["pending","accepted","rejected"]);
