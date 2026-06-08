import AuthService from "./auth.service.js";

class AuthController {


    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    message: "invalid credentials",
                    success: false
                })
            }

            const result = await AuthService.login(email, password);

            res.cookie("token", result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })

            return res.status(200).json({
                message: "Login successful",
                success: true,
                data: result.data,
            })

        } catch (error) {
            console.log(error)
            return res.status(401).json({
                message: error.message,
                success: false
            })

        }
    }

    async logout(req, res) {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(200).json({
            message: "Logged out successfully",
            success: true
        });
    }

    async me(req, res) {
        try {
            const dashboardData = req.user.role === "professor"
                ? await AuthService.getProfessorDashboardData(req.user.id)
                : await AuthService.getDashboardData(req.user.id);

            return res.status(200).json({
                success: true,
                data: dashboardData,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }


    async getDashboardData(req, res) {
        try {
            const dashboardData = await AuthService.getDashboardData(req.user.id);
                // console.log("jiiii")
            return res.status(200).json({
                success: true,
                data: dashboardData,
            });
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async getProfessorDashboardData(req, res) {
        try {
            const dashboardData = await AuthService.getProfessorDashboardData(req.user.id);

            return res.status(200).json({
                success: true,
                data: dashboardData,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }



}


export default new AuthController();
