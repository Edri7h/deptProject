import MentorService from "./mentor.service.js";

class MentorController {

    async searchProfessor(req, res) {

        try {

            const { info } = req.query;

            const professors =
                await MentorService.searchProfessor(
                    info,
                    req.user.dept
                );

            return res.status(200).json({
                success: true,
                data: professors
            });

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }
    }

    async sendMentorRequest(req, res) {

        try {

            const {
                teamId,
                professorId
            } = req.body;

            const result =
                await MentorService.sendMentorRequest({

                    senderId: req.user.id,

                    professorId,

                    teamId
                });

            return res.status(200).json({
                success: true,
                message:
                    "Mentor request sent successfully",
                data: result
            });

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }
    }

    async getSentMentorRequests(req, res) {

        try {

            const requests =
                await MentorService.getSentMentorRequests(
                    req.user.id
                );

            return res.status(200).json({
                success: true,
                data: requests
            });

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }
    }

    async cancelMentorRequest(req, res) {

        try {

            const { requestId } = req.params;

            const result =
                await MentorService.cancelMentorRequest(
                    req.user.id,
                    requestId
                );

            return res.status(200).json({
                success: true,
                message: result
            });

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }
    }

    async getMentorRequests(req, res) {

        try {

            const requests =
                await MentorService.getMentorRequests(
                    req.user.id
                );

            return res.status(200).json({
                success: true,
                data: requests
            });

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }
    }

    async acceptMentorRequest(req, res) {

        try {

            const {
                requestId,
                notificationId
            } = req.body;

            const result =
                await MentorService.acceptMentorRequest({

                    professorId:
                        req.user.id,

                    requestId,

                    notificationId
                });

            return res.status(200).json({
                success: true,
                message: result
            });

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }
    }

    async rejectMentorRequest(req, res) {

        try {

            const {
                requestId,
                notificationId
            } = req.body;

            const result =
                await MentorService.rejectMentorRequest({

                    professorId:
                        req.user.id,

                    requestId,

                    notificationId
                });

            return res.status(200).json({
                success: true,
                message: result
            });

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }
    }
}

export default new MentorController();