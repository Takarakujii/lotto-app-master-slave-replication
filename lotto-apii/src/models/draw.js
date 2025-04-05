// models/draw.js
import { masterDb, slaveDb } from "../core/database.js";

class Draw {
    constructor() {
        this.master = masterDb;
        this.slave = slaveDb;
    }

    async distributePrizes(winningNumber, drawId) {
        try {
            // Get all unprocessed bets
            const [allBets] = await this.slave.execute(
                "SELECT bet_id, user_id, bet_amount, bet_number FROM bets WHERE draw_id IS NULL"
            );

            // Find all winning bets
            const winners = allBets.filter(bet =>
                this.isExactMatch(bet.bet_number, winningNumber)
            );

            // Get current pot amount
            const [potResult] = await this.slave.execute(
                "SELECT pot_amount FROM pot WHERE pot_id = 1"
            );
            const potAmount = potResult[0].pot_amount;

            // Distribute to winners if any
            if (winners.length > 0) {
                const prizePerWinner = potAmount / winners.length;
                console.log("may winner ba", winners.length);

                // Update winners' balances and record results
                for (const winner of winners) {
                    // Credit winner's account
                    await this.master.execute(
                        "UPDATE users SET user_balance = user_balance + ? WHERE user_id = ?",
                        [prizePerWinner, winner.user_id]
                    );

                    // Record win
                    await this.master.execute(
                        "INSERT INTO win_result (bet_id, draw_id, user_id, winning_prize) VALUES (?, ?, ?, ?)",
                        [winner.bet_id, drawId, winner.user_id, prizePerWinner]
                    );
                }

                // Reset pot to zero
                await this.master.execute(
                    "UPDATE pot SET pot_amount = 0 WHERE pot_id = 1"
                );
            }

            // Mark all bets as processed
            await this.master.execute(
                "UPDATE bets SET draw_id = ? WHERE draw_id IS NULL",
                [drawId]
            );

            return
        } catch (err) {
            console.error("Prize distribution error:", err);
            throw err;
        }
    }

    async generateWinningNumber() {
        try {
            // Generate 6 unique numbers between 1-47
            const numbers = new Set();
            while (numbers.size < 6) {
                numbers.add(Math.floor(Math.random() * 47) + 1);
            }

            /*
            const winningNumber = Array.from(numbers)
                .map(n => n.toString().padStart(2, "0"))
                .join("-");
            */

            const winningNumber = "11-12-13-14-15-16"

            // Create draw record
            const [drawResult] = await this.master.execute(
                "INSERT INTO draw (winning_number) VALUES (?)",
                [winningNumber]
            );
            const drawId = drawResult.insertId;

            // Distribute prizes
            const distributionResult = await this.distributePrizes(winningNumber, drawId);

            return {
                winningNumber,
                distributionResult
            };
        } catch (err) {
            console.error("<error> draw.generateWinningNumber", err);
            throw err;
        }
    }

    async getLastDraw() {
        try {
            const [lastDraws] = await this.slave.execute(
                `SELECT d.*, p.pot_amount 
                 FROM draw d
                 LEFT JOIN pot p ON 1=1
                 ORDER BY d.created_at DESC 
                 LIMIT 1`
            );

            if (lastDraws.length === 0) {
                return {
                    winning_number: '00-00-00-00-00-00',
                    pot_amount: 0,
                    created_at: new Date(0)
                };
            }

            return lastDraws[0];
        } catch (err) {
            console.error("<error> draw.getLastDraw", err);
            throw err;
        }
    }

    isExactMatch(betNumber, winningNumber) {
        return betNumber === winningNumber;
    }
}

export default Draw;