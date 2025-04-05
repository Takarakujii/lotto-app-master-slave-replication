import { masterDb, slaveDb } from "../core/database.js";

class WinResult {
    constructor() {
        this.master = masterDb;
        this.slave = slaveDb;
    }

    /**
     * Get the winning history for a user.
     * @param {number} userId - The user ID.
     * @returns {Promise<Array>} - The user's winning history.
     */
    async getWinningHistory(userId) {
        try {
            const [winningHistory] = await this.slave.execute(
                `SELECT 
                    ld.winning_number, 
                    wr.winning_prize,  -- Fetch winning_prize from winresult
                    ld.created_at, 
                    u.username
                 FROM bets b
                 JOIN draw ld ON b.draw_id = ld.draw_id
                 JOIN users u ON b.user_id = u.user_id
                 JOIN win_result wr ON wr.bet_id = b.bet_id -- Link winresult to bets
                 WHERE b.user_id = ?
                 ORDER BY ld.created_at DESC`,  // Sorting by most recent draws
                [userId]
            );

            return winningHistory;
        } catch (err) {
            console.error("<error> winResult.getWinningHistory", err);
            throw err;
        }
    }
}

export default WinResult;
