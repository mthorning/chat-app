const UserModel = require("./mongo/models/User");
const MessageModel = require("./mongo/models/Message");

module.exports = io => socket => {
    let userId;

    socket.on("user connected", packet => {
        sendMessageHistory();
        userId = packet.id;
        UserModel.findByIdAndUpdate(userId, { $set: { online: true } }, err => {
            if (err) console.error(err);
            sendOnlineUsers();
        });
    });

    socket.on("chat message", packet => {
        console.log(packet);
        saveMessage(packet);
        let responsePacket = { ...packet };
        io.emit("chat message", responsePacket);
    });

    socket.on("adult message", packet => {
        let responsePacket = { ...packet };
        io.emit("adult message", responsePacket);
    });

    socket.on("disconnect", () => {
        UserModel.findByIdAndUpdate(
            userId,
            { $set: { online: false } },
            err => {
                if (err) console.error(err);
                sendOnlineUsers();
            }
        );
    });

    function sendOnlineUsers() {
        UserModel.find({ online: true }, (err, users) => {
            if (err) console.error(err);
            io.emit("online users", users);
        });
    }

    function saveMessage(packet) {
        MessageModel.create(packet, err => {
            if (err) console.err(err);
        });
    }

    function sendMessageHistory() {
        console.log("Retrieving message history...");
        MessageModel.find({}, (err, messages) => {
            if (err) console.error(err);
            console.log("Retrieved messages", messages);
            io.emit("message history", messages);
        });
    }
};
