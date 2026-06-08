class TeamValidation {

    validateCreateTeam(req, res, next) {

        const { teamName, projectId } = req.body;

        if (!teamName) {
            return res.status(400).json({
                success: false,
                message: "Team name is required"
            });
        }

        if (!projectId) {
            return res.status(400).json({
                success: false,
                message: "Project id is required"
            });
        }

        next();
    }
}

export default new TeamValidation();