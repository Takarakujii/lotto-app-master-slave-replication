import { Router } from "express";
import WinResultController from "../../controllers/v1/winResultController.js";
import authentication from "../../middlewares/authentication.js";

const winResultRouter = Router();
const winResultController = new WinResultController();

// Apply authentication middleware
winResultRouter.use(authentication);

// Get the winning history for a user
// GET /win-result/history
winResultRouter.get("/history", winResultController.getWinningHistory.bind(winResultController));

export default winResultRouter;