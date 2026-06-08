
import ProjectService from "./project.service.js";

class ProjectController{

    async getAvailableProjects(req,res){
        try{
            const projects=await ProjectService.getAvailableProjects();
            
            return res.status(200).json({
                message: "Projects retrieved successfully",
                success: true,
                data: projects
            });
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error.message,
                success: false
            });
        }
    }



    // async pickProject(req,res){
    //     try {
    //         const userId= req.user.id;
    //         const data=await ProjectService
            
    //     } catch (error) {
            
    //     }
    // }

    
}

export default new ProjectController;