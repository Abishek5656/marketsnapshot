import express from "express";
import { getMarketSnapshot } from "../controllers/market.controller.js";

const router = express.Router();

router.get("/snapshot", getMarketSnapshot);

export default router;
