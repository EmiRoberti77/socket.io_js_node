import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
const app = express();
const port = 8000;
//create http server
const server = createServer(app);
//to start the socket serevr pass the http server
//in the constructor of the socket server
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));
app.get("/", (req, res) => {
  const path = join(__dirname, "..", "public", "index.html");
  res.sendFile(path);
});

//create a event listener for connected new clients
io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("messages", (msg) => {
    console.log(msg);
    //send back encho message
    // "messages" is the event name the client will lister too.
    // ">" + msg echo message back to the client
    socket.emit("messages", ">" + msg);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () => {
  console.log(port, "server started", new Date().toISOString());
});
