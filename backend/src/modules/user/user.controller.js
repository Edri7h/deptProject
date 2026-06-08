import UserService from "./user.service.js";

class UserController {

    async getNotifications(req, res) {

        try {

            const notifications =
                await UserService.getNotifications(
                    req.user.id
                );

            return res.status(200).json({
                success: true,
                data: notifications
            });

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }
    }

    async acceptTeamInvite(req, res) {

        try {

            const {
                requestId,
                notificationId
            } = req.body;

            const response =
                await UserService.acceptTeamInvite({
                    userId: req.user.id,
                    requestId,
                    notificationId
                });

            return res.status(200).json({
                success: true,
                message: response
            });

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }
    }

    async rejectTeamInvite(req, res) {

        try {

            const {
                requestId,
                notificationId
            } = req.body;

            const response =
                await UserService.rejectTeamInvite({
                    userId: req.user.id,
                    requestId,
                    notificationId
                });

            return res.status(200).json({
                success: true,
                message: response
            });

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }
    }
}

export default new UserController();