const onlineUsers = new Map();

const ackSafe = (ackCallback, payload) => {
  if (typeof ackCallback === "function") {
    ackCallback(payload);
  }
};

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("用户连接", socket.id);

    const registerOnlineUser = (userId) => {
      if (userId == null) return;
      const id = String(userId);
      onlineUsers.set(id, socket.id);
      socket.join(id);
      socket.data.userId = id;
      io.emit("get_online_users", Array.from(onlineUsers.keys()));
    };

    // 与前端 Chat.jsx 中的 emit("add-user", ...) 对齐
    socket.on("add-user", registerOnlineUser);
    socket.on("user_connected", registerOnlineUser);

    socket.on("join_chat_room", (roomName) => {
      if (!roomName || typeof roomName !== "string") return;
      socket.join(roomName);
      console.log("加入房间", roomName, socket.id);
    });

    /**
     * 可靠投递：先 REST 落库拿到 _id，再带 ACK 做一次实时推送。
     * payload: { from, to, message, _id }
     */
    socket.on("send_message", async (payload, ackCallback) => {
      try {
        const { from, to, message, _id } = payload || {};
        console.log(
          "[socket] send_message payload:",
          payload,
          "ackCallback type:",
          typeof ackCallback
        );
        if (!from || !to || message == null || message === "") {
          ackSafe(ackCallback, { success: false, error: "参数不完整" });
          return;
        }
        if (_id == null) {
          ackSafe(ackCallback, { success: false, error: "缺少 messageId" });
          return;
        }
        if (socket.data.userId && String(socket.data.userId) !== String(from)) {
          ackSafe(ackCallback, { success: false, error: "禁止冒充他人发消息" });
          return;
        }

        const userPair = [String(from), String(to)].sort();
        const roomName = `room_${userPair[0]}_${userPair[1]}`;
        const out = {
          _id,
          from: String(from),
          to: String(to),
          message,
        };

        // 会话房间：双方打开该聊天时都会 join，排除当前发送 socket 避免发件人多收一条
        socket.to(roomName).emit("new_message", out);
        // 收件人个人房间：即使用户还没打开该会话，也能收到（可能与上面重复，由前端按 _id 去重）
        io.to(String(to)).emit("new_message", out);

        ackSafe(ackCallback, { success: true, messageId: _id });
        console.log("[socket] send_message ack sent:", { success: true, messageId: _id });
      } catch (error) {
        ackSafe(ackCallback, { success: false, error: error.message });
        console.log("[socket] send_message ack sent (fail):", { success: false, error: error.message });
      }
    });

    socket.on("disconnect", () => {
      const userId = socket.data.userId;
      if (userId) {
        onlineUsers.delete(String(userId));
      }
      io.emit("get_online_users", Array.from(onlineUsers.keys()));
    });
  });
};

module.exports = socketHandler;