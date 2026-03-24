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

const onlineUsers = new Map();

// 监听新连接
io.on("connection", (socket) => {
  // 记录该连接对应的用户 socketId（userId -> socket.id）

  // 客户端发送事件：socket.emit("add-user", userId)
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  // 发送消息转发给接收方
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);   //找到接收方的socket.id
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("recieve-msg", data.message);  //如果接收方在线，就把消息发给那个socket
    }
  });
});