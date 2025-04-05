// controllers/topupController.js
import TopUp from "../../models/topUp.js";

class TopUpController {
    constructor() {
        this.topup = new TopUp();
    }

    /**
     * Handle balance top-up.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async topUp(req, res) {
        try {
            const { amount } = req.body || {};
            const userId = res.locals.user_id; // Extracted from authentication middleware

            if (!amount || amount <= 0) {
                return res.send({
                    success: false,
                    message: "Invalid top-up amount",
                });
            }

            const result = await this.topup.topUpBalance(userId, amount);

            res.send({
                success: true,
                message: "Balance topped up successfully",
            });
        } catch (err) {
            res.send({
                success: false,
                message: err.toString(),
            });
        }
    }
}

export default TopUpController;
