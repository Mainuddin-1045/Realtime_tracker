const express = require("express");
const app = express();
const PORT = 8082;

const http = require("http");
const path = require("path");

const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
  console.log(`User connected with socket ID: ${socket.id}`);

  socket.on("send-location", function (data) {
    console.log(`Received location from ID: ${socket.id} - Lat: ${data.latitude}, Lng: ${data.longitude}`);
    io.emit("receive-location", { id: socket.id, ...data });
  });

  socket.on("disconnect", function () {
    console.log(`User disconnected with socket ID: ${socket.id}`);
    io.emit("user-disconnected", socket.id);
  });
});

app.get("/", function (req, res) {
  res.render("index");
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
