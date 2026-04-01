import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";
import morgan from "morgan";
import cors from "cors";
import path from "path";

const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors({
  origin: ["http://localhost:5173",
    "https://genaichat.onrender.com"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}))
app.use(express.static("./public"));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth",authRouter)
app.use("/api/chats",chatRouter)
app.get("*", (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});


export default app;
