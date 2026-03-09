import express from "express";
import rateLimit from "express-rate-limit";
import { chatWithAssistant } from "../controllers/chatController.js";

const router = express.Router();

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    error: "Too many chat requests. Please try again after a minute.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", chatLimiter, chatWithAssistant);

export default router;
