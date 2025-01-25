import { Router } from "express";
import { completeProfile, getCurrentUser, getStarted } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const app = Router();

app.route("/get-started").post(getStarted);

app.route("/complete-profile").post(authMiddleware , completeProfile);
app.route("/get-current-user").post(authMiddleware , getCurrentUser);

export default app