import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import { testAi } from "./services/ai.service.js";

const app = express();
testAi();

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth",authRouter)

export default app;
