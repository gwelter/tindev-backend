const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const connectedUsers = {}

io.on('connection', socket => {
  const { user } = socket.handshake.query;
  connectedUsers[user] = socket.id;

  console.log(connectedUsers)
});

mongoose.connect(
  "mongodb+srv://omnistack:11223344@cluster0-6ilul.mongodb.net/omnistack8?retryWrites=true&w=majority",
  {
    useNewUrlParser: true
  }
);

//middleware para passar socket ao controller
app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;

  return next();
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333, () => console.log("Ouvindo na porta 3333"));
