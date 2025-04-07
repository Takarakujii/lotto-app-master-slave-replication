// models/bet.js
import { masterDb, slaveDb } from "../core/database.js";

class Bet {
    constructor() {
        this.master = masterDb;
        this.slave = slaveDb;
    }

    validateBetNumber(betNumber) {
        const parts = betNumber.split('-');
        if (parts.length !== 6) return false;

        const numbers = new Set();
        for (const numStr of parts) {
            const num = parseInt(numStr, 10);
            if (isNaN(num) || num < 1 || num > 47) return false;
            if (numbers.has(num)) return false;
            numbers.add(num);
        }
        return true;
    }

    async createBet(userId, betAmount, betNumber) {
        try {
            if (!this.validateBetNumber(betNumber)) {
                throw new Error("Invalid bet format. Requires 6 unique numbers (1-47) in xx-xx-xx-xx-xx-xx format");
            }

            // Deduct from user balance
            const [userUpdate] = await this.master.execute(
                "UPDATE users SET user_balance = user_balance - ? WHERE user_id = ? AND user_balance >= ?",
                [betAmount, userId, betAmount]
            );

            if (userUpdate.affectedRows === 0) {
                throw new Error("Insufficient balance or user not found");
            }

            // Add to pot
            await this.master.execute(
                "UPDATE pot SET pot_amount = pot_amount + ? WHERE pot_id = 1",
                [betAmount]
            );

            // Create the bet
            const [result] = await this.master.execute(
                "INSERT INTO bets (user_id, bet_amount, bet_number) VALUES (?, ?, ?)",
                [userId, betAmount, betNumber]
            );

            return result;
        } catch (err) {
            console.error("<error> bet.createBet", err);
            throw err;
        }
    }

    async getUserBets(userId) {
        try {
            const [bets] = await this.slave.execute(
                `SELECT b.*, d.winning_number, wr.winning_prize 
                 FROM bets b
                 LEFT JOIN draw d ON b.draw_id = d.draw_id
                 LEFT JOIN win_result wr ON b.bet_id = wr.bet_id
                 WHERE b.user_id = ?
                 ORDER BY b.created_at DESC`,
                [userId]
            );
            return bets;
        } catch (err) {
            console.error("<error> bet.getUserBets", err);
            throw err;
        }
    }

    async getBetsByDrawId(drawId) {
        try {
            const [bets] = await this.slave.execute(
                `SELECT b.*, u.username, wr.winning_prize 
                 FROM bets b
                 JOIN users u ON b.user_id = u.user_id
                 LEFT JOIN win_result wr ON b.bet_id = wr.bet_id
                 WHERE b.draw_id = ?
                 ORDER BY b.created_at DESC`,
                [drawId]
            );
            return bets;
        } catch (err) {
            console.error("<error> bet.getBetsByDrawId", err);
            throw err;
        }
    }

    async deleteBet(betId) {
        try {
            const [result] = await this.master.execute(
                "DELETE FROM bets WHERE bet_id = ?",
                [betId]
            );

            if (result.affectedRows === 0) {
                throw new Error("Bet not found");
            }

            return result;
        } catch (err) {
            console.error("<error> bet.deleteBet", err);
            throw err;
        }
    }
}


export default Bet;