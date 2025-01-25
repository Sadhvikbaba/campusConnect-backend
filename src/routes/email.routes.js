import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { emailFinder, getUserEmails } from "../controllers/email.controller.js";

const app = Router();

app.route("/send-mail").post(authMiddleware , emailFinder);

app.route("/mails").get(authMiddleware , getUserEmails);

export default app