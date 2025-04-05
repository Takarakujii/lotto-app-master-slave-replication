// routes/topupRoutes.js
import { Router } from "express";
import TopUpController from "../../controllers/v1/topUpController.js";
import authentication from "../../middlewares/authentication.js";

const topUpRouter = new Router();
const topup = new TopUpController();

// Apply authentication middleware

// Top Up Balance
// POST /topup { "amount": 100 }
topUpRouter.post("/", authentication, topup.topUp.bind(topup));

export default topUpRouter;
