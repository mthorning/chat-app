const path = require("path");
const UserModel = require("./mongo/models/User");
const MessageModel = require("./mongo/models/Message");
const cloudinary = require("cloudinary").v2;

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

  socket.on("upload image", ({ name, file, ...rest }) => {
    cloudinary.uploader.upload(
      file,
      {
        resource_type: "image",
        tags: ["squishychat"],
        public_id: `squishychat/${
          name.substring(0, name.lastIndexOf(".")) || name
        }`,
        overwrite: true,
      },
      function (error, result) {
        if (error) {
          console.error("Error uploading image: ", JSON.stringify(error));
        } else {
          saveMessage({
            ...rest,
            message: result.secure_url,
            img: true,
            imgId: result.public_id,
          });
        }
      }
    );
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
    console.log("saving message", packet);
    MessageModel.create(packet, (err, message) => {
      if (err) {
        console.error(err);
      } else {
        io.emit("chat message", message);
      }
    });
  }

  function deleteMessage(id) {
    MessageModel.findOneAndDelete({ _id: id }, (err, message) => {
      if (err) {
        console.error(err);
      } else {
        io.emit("message deleted", id);
        if (message.img) {
          cloudinary.api.delete_resources([message.imgId], {}, (err) => {
            if (err) console.error(err);
          });
        }
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
