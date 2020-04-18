const UserModel = require("./mongo/models/User");
const MessageModel = require("./mongo/models/Message");

module.exports = (io) => (socket) => {
  let userId;

  socket.on("user connected", (packet) => {
    sendMessageHistory();
    userId = packet.id;
    UserModel.findByIdAndUpdate(userId, { $set: { online: true } }, (err) => {
      if (err) console.error(err);
      sendOnlineUsers();
    });
  });

  socket.on("chat message", (packet) => {
    saveMessage(packet);
  });

  socket.on("adult message", (packet) => {
    let responsePacket = { ...packet };
    io.emit("adult message", responsePacket);
  });

  socket.on("delete message", (id) => {
    deleteMessage(id);
  });

  socket.on("disconnect", () => {
    UserModel.findByIdAndUpdate(userId, { $set: { online: false } }, (err) => {
      if (err) console.error(err);
      sendOnlineUsers();
    });
  });

  function sendOnlineUsers() {
    UserModel.find({ online: true }, (err, users) => {
      if (err) console.error(err);
      io.emit("online users", users);
    });
  }

  function saveMessage(packet) {
    MessageModel.create(packet, (err, message) => {
      if (err) {
        console.error(err);
      } else {
        io.emit("chat message", message);
      }
    });
  }

  function deleteMessage(id) {
    MessageModel.deleteOne({ _id: id }, (err) => {
      if (err) {
        console.error(err);
      } else {
        io.emit("message deleted", id);
      }
    });
  }

  function sendMessageHistory() {
    MessageModel.find({}, (err, messages) => {
      if (err) console.error(err);
      io.emit("message history", messages);
    });
  }
};
