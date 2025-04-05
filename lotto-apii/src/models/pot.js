import { masterDb, slaveDb } from "../core/database.js";

class Pot {
    constructor() {
        this.master = masterDb;
        this.slave = slaveDb;
    }

    async getPot() {
        try {
            // Check if pot exists
            const [potExists] = await this.slave.execute(
                "SELECT 1 FROM pot LIMIT 1"
            );

            // Initialize if it doesn't exist
            if (potExists.length === 0) {
                await this.connection.execute(
                    "INSERT INTO pot (pot_amount) VALUES (1000000)"
                );
            }

            // Get current pot amount
            const [pot] = await this.slave.execute(
                "SELECT pot_amount FROM pot LIMIT 1"
            );

            let currentPot = pot.length > 0 ? pot[0].pot_amount : 0;

            // ✅ If pot is empty or 0, reset it to 1 million
            if (!currentPot || currentPot <= 0) {
                await this.master.execute(
                    "UPDATE pot SET pot_amount = 1000000 WHERE pot_id = 1"
                );
                currentPot = 1000000;
            }

            return currentPot;
        } catch (err) {
            console.error("<error> pot.getPot", err);
            throw err;
        }
    }

    async updatePot(amount) {
        try {
            const [result] = await this.slave.execute(
                "SELECT pot_amount FROM pot ORDER BY pot_id DESC LIMIT 1"
            );

            let currentPot = result.length > 0 ? result[0].pot_amount : 0;
            let updatedPot = currentPot + amount;

            // ✅ If pot goes below 0, reset to 1 million
            if (updatedPot <= 0) {
                updatedPot = 1000000;
            }

            await this.master.execute(
                "UPDATE pot SET pot_amount = ? WHERE pot_id = 1",
                [updatedPot]
            );

            return updatedPot;
        } catch (err) {
            console.error("<error> pot.updatePot", err);
            throw err;
        }
    }
}

export default Pot;
