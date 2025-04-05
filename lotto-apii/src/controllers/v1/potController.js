import Pot from "../../models/pot.js";

class PotController {
    constructor() {
        this.pot = new Pot();
    }

    /**
     * Get the current pot amount.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async getPot(req, res) {
        try {
            console.log('Get pot amount request received');
            const potAmount = await this.pot.getPot();

            res.status(200).send({
                success: true,
                potAmount,
            });
        } catch (err) {
            console.error('Error getting pot:', err);
            res.status(500).send({
                success: false,
                message: err.toString(),
            });
        }
    }

    /**
     * Update the pot amount.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async updatePot(req, res) {
        try {
            const { amount } = req.body;

            if (amount === undefined || isNaN(amount)) {
                return res.status(400).send({
                    success: false,
                    message: "Invalid amount",
                });
            }

            const result = await this.pot.updatePot(amount);

            res.status(200).send({
                success: true,
                message: "Pot updated successfully",
                data: result,
            });
        } catch (err) {
            res.status(500).send({
                success: false,
                message: err.toString(),
            });
        }
    }
}

export default PotController;
