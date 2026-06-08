import JwtService from "../utils/jwt.js"

class AuthMiddleware {
    authenticate(req, res, next) {
        try {
            const token = req.cookies.token
            if (!token) {
                return res.status(401).json({
                    message: "Unauthorized",
                    success: false
                })
            }
            // console.log("jiii")

            const decoded = JwtService.verifyToken(token);

            req.user = decoded;

            next();
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: "Internal Server Error",
                success: false
            })
        }

    }

}

export default  new AuthMiddleware();
