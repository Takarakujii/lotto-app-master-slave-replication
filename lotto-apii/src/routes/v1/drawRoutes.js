import { Router } from "express";
import DrawController from "../../controllers/v1/drawController.js";
import authentication from "../../middlewares/authentication.js";

const drawRouter = new Router();
const drawController = new DrawController();

drawRouter.use(authentication);

// Generate a new winning number
// POST /draw/generate
drawRouter.post("/", drawController.generateWinningNumber.bind(drawController));

// Get the results of the last draw
// GET /draw/last
drawRouter.get("/last", drawController.getLastDraw.bind(drawController));

export default drawRouter;