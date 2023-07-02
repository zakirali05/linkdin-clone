const { Socket } = require("socket.io");

const io = require("socket.io")(5000, {
  cors: {
    origin: "https://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`user connected to ${socket.id}`);
});
