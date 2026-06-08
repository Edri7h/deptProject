import TeamService from "./team.service.js";

class TeamController {

    async createTeam(req, res) {

        try {

            const teamData = {
                ...req.body,
                leaderId: req.user.id
            };

            const team =
                await TeamService.createTeam(
                    teamData
                );

            return res.status(201).json({
                success: true,
                message: "Team created successfully",
                data: team
            });

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }
    }

    async searchStudent(req, res) {

        try {

            const { info } = req.query;

            const students =
                await TeamService.searchStudent(
                    info,
                    req.user.dept,
                    req.user.id
                );

            return res.status(200).json({
                success: true,
                data: students
            });

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }
    }

    async sendTeamInvite(req, res) {

        try {
            // console.log("jii")
            const { teamId } = req.params;
            // console.log(teamId)

            const { receiverId } = req.body;
            // console.log(teamId,receiverId)

            const result =
                await TeamService.sendTeamInvite({

                    senderId: req.user.id,

                    receiverId,

                    teamId,

                    senderName: req.user.name
                });

            return res.status(200).json({
                success: true,
                message: "Invite sent successfully",
                 result
            });

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }
    }

    async getMyTeam(req, res) {

        try {

            const team =
                await TeamService.getMyTeam(
                    req.user.id
                );

            return res.status(200).json({
                success: true,
                data: team
            });

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }
    }

    async getSentInvites(req, res) {

        try {

            const invites =
                await TeamService.getSentInvites(
                    req.user.id
                );

            return res.status(200).json({
                success: true,
                data: invites
            });

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }
    }

    async cancelInvite(req, res) {

        try {

            const { requestId } = req.params;

            const result =
                await TeamService.cancelInvite(
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
    
}

export default new TeamController();