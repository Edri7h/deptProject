import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";

import { project } from "../../db/schema/project.js";

class ProjectService {

     async getAvailableProjects() {


        const projects = await db.query.project.findMany({
            where: eq(project.isAssigned, false)
        })

        return projects;

    }

   



}


export default new ProjectService();