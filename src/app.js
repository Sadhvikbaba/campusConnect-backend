import express from "express"
import cors from "cors"

const app = express()


app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token', 'Access-Control-Allow-Headers', 'Access-Control-Allow-Methods'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import userRouter from "./routes/user.routes.js"
import mailRouter from "./routes/email.routes.js"

app.use("/api/v1/user" , userRouter);
app.use("/api/v1/email" , mailRouter);

export {app}