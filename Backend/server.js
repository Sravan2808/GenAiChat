import "dotenv/config";
import mongoose from "mongoose";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import {createServer} from "http";
import {initSocket} from "./src/sockets/server.socket.js";


const httpServer = createServer(app);

initSocket(httpServer);

const port = process.env.PORT || 3000;

connectDB();
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
