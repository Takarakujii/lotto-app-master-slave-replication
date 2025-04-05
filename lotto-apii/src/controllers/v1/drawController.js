// controllers/drawController.js
import Draw from "../../models/draw.js";

class DrawController {
    constructor() {
        this.draw = new Draw();
    }

    async generateWinningNumber(req, res) {
        try {
            const result = await this.draw.generateWinningNumber();
            
            res.status(200).send({
                success: true,
                message: "Winning number generated and prizes distributed",
                winningNumber: result.winningNumber,
                distribution: result.distributionResult,
                timestamp: new Date().toISOString()
            });
        } catch (err) {
            res.status(500).send({
                success: false,
                message: err.toString()
            });
        }
    }
    /**
     * Get last draw results
     */
    async getLastDraw(req, res) {
        try {
            const lastDraw = await this.draw.getLastDraw();
            
            const isEmptyDraw = lastDraw.winning_number === '00-00-00-00-00-00' && 
                              new Date(lastDraw.created_at).getTime() === new Date(0).getTime();
            
            res.status(200).send({
                success: true,
                winning_number: lastDraw.winning_number,
                pot_amount: lastDraw.pot_amount || 0,
                draw_time: lastDraw.created_at,
                is_empty: isEmptyDraw
            });
        } catch (err) {
            res.status(500).send({
                success: false,
                message: err.toString()
            });
        }
    }
}

export default DrawController;