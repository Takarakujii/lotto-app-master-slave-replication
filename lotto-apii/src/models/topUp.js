// models/topup.js
import { masterDb, slaveDb } from "../core/database.js";

class TopUp {
    constructor() {
        this.master = masterDb;
        this.slave = slaveDb;
    }

    /**
     * Top up user balance.
     * @param {number} userId - The ID of the user.
     * @param {number} amount - The amount to top up.
     * @returns {Promise<Object>} - The result of the database operation.
     */
    async topUpBalance(userId, amount) {
        try {
            const [result] = await this.master.execute(
                "UPDATE users SET user_balance = user_balance + ? WHERE user_id = ?",
                [amount, userId]
            );

            if (result.affectedRows === 0) {
                throw new Error("User not found");
            }

            return result;
        } catch (err) {
            console.error("<error> topup.topUpBalance", err);
            throw err;
        }
    }
}

export default TopUp;
