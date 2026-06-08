

class RoleMiddleware{

     verifyProfessorRole(req,res,next){
        try{
            if(req.user.role!=="professor"){
                return res.status(403).json({
                    message:"Forbidden: Access is denied",
                    success:false
                })
            }
            next();
        }catch(error){
            return res.status(500).json({
                message:"Internal Server Error",
                success:false
            })

        }
    }

     verifyStudentRole(req,res,next){
        try{
            if(req.user.role!=="student"){      
                return res.status(403).json({
                    message:"Forbidden: Access is denied",
                    success:false
                })
            }
            next();

        }catch(error){
            return res.status(500).json({
                message:"Internal Server Error",
                success:false
            })  
        }  

    } 
}

export default new RoleMiddleware();