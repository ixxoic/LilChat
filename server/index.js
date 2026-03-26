const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messagesRoute');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');


const app = express();
require('dotenv').config();


app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  }
));

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.log(err.message);
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  },
});

const socketHandler = require("./utils/socket");
socketHandler(io);