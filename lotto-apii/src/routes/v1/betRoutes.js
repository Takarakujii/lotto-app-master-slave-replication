// routes/betRoutes.js
import { Router } from "express";
import BetController from "../../controllers/v1/betController.js";
import authentication from "../../middlewares/authentication.js";

const betRouter = new Router();
const betController = new BetController();

// Apply authentication middleware
betRouter.use(authentication);

// Create a new bet
// POST /bets { "betAmount": 100, "betNumber": "12-34-56-78-90-12" }
betRouter.post("/", betController.createBet.bind(betController));

// Get user's bet history - GET /bets
betRouter.get("/", betController.getUserBets.bind(betController));

// Delete a bet by ID
// DELETE /bets/:betId
betRouter.delete("/:betId", betController.deleteBet.bind(betController));

export default betRouter;