import WinResult from "../../models/winResult.js";

class WinResultController {
    constructor() {
        this.winResult = new WinResult();
    }

    /**
     * Get the winning history for a user.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async getWinningHistory(req, res) {
        try {
            const userId = res.locals.user_id; // Extracted from authentication middleware

            const winningHistory = await this.winResult.getWinningHistory(userId);

            res.status(200).send({
                success: true,
                winningHistory,
            });
        } catch (err) {
            res.status(500).send({
                success: false,
                message: err.toString(),
            });
        }
    }

    
}

export default WinResultController;