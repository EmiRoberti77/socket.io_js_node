# socket.io framework.

## server code

```node
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
  //listen to disconnection event from the client
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () => {
  console.log(port, "server started", new Date().toISOString());
});
```

# differe responses from the server

- 1 this will respond only to the client socket that the server received a message from

```node
socket.emit("messages", ">" + msg);
```

- 2 this will respond to all sockets connected to the server at the same time

```node
io.emit("messages", ">" + msg);
```

- 3 this will respond to all sockets connected to the server with the exception of the socket that sent the message

```node
socket.broadcast.emit("messages", ">" + msg);
```

## client code

```javascript
<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title>Socket.IO chat</title>
    <style>
      body {
        margin: 0;
        padding-bottom: 3rem;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Helvetica, Arial, sans-serif;
      }

      #form {
        background: rgba(0, 0, 0, 0.15);
        padding: 0.25rem;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        height: 3rem;
        box-sizing: border-box;
        backdrop-filter: blur(10px);
      }
      #input {
        border: none;
        padding: 0 1rem;
        flex-grow: 1;
        border-radius: 2rem;
        margin: 0.25rem;
      }
      #input:focus {
        outline: none;
      }
      #form > button {
        background: #333;
        border: none;
        padding: 0 1rem;
        margin: 0.25rem;
        border-radius: 3px;
        outline: none;
        color: #fff;
      }

      #messages {
        list-style-type: none;
        margin: 0;
        padding: 0;
      }
      #messages > li {
        padding: 0.5rem 1rem;
      }
      #messages > li:nth-child(odd) {
        background: #efefef;
      }
    </style>
  </head>
  <body>
    <ul id="messages"></ul>
    <form id="form" action="">
      <input id="input" autocomplete="off" /><button>Send</button>
    </form>
  </body>
</html>
<script>
  const socket = io();
  const form = document.getElementById("form");
  const input = document.getElementById("input");
  const messages = document.getElementById("messages");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("input", input.value);
    if (input.value) {
      socket.emit("messages", input.value);
      input.value = "";
    }
  });

  socket.on("messages", (msg) => {
    const item = document.createElement("li");
    item.textContent = msg;
    messages.appendChild(item);
    messages.scrollTo(0, document.body.scrollHeight);
  });
</script>

```
