const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const roomStrokes = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);

    console.log(
      `${socket.id} joined ${roomId}`
    );

    if (!roomStrokes[roomId]) {
      roomStrokes[roomId] = [];
    }

    socket.emit(
      "load-strokes",
      roomStrokes[roomId]
    );
  });

  socket.on(
    "draw-stroke",
    ({ roomId, stroke }) => {
      if (!roomStrokes[roomId]) {
        roomStrokes[roomId] = [];
      }

      roomStrokes[roomId].push(stroke);

      io.to(roomId).emit(
        "board-updated",
        roomStrokes[roomId]
      );
    }
  );

  socket.on(
    "sync-board",
    ({ roomId, strokes }) => {
      roomStrokes[roomId] = strokes;

      io.to(roomId).emit(
        "board-updated",
        strokes
      );
    }
  );

  socket.on("disconnect", () => {
    console.log(
      "User disconnected:",
      socket.id
    );
  });
});

server.listen(5000, () => {
  console.log(
    "Server running on port 5000"
  );
});