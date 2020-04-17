import React, { useContext } from "react";
import PropTypes from "prop-types";
import { UserContext, SocketContext } from "contexts";
import { MdDelete } from "react-icons/md";

const propTypes = {
  message: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

function Message(props) {
  const { _id: msgId, message, displayName, id, adult, bin } = props;
  const [binId, setBinId] = bin;
  const whoiam = useContext(UserContext);
  const socket = useContext(SocketContext);

  function deleteMessage() {
    socket.emit("delete message", msgId);
  }

  switch (true) {
    case id === whoiam.id && adult:
      return <div className="message own-adult-msg">{message}</div>;
    case id === whoiam.id:
      return (
        <div
          className="message own-msg"
          data-id={msgId}
          onClick={() => setBinId(msgId)}
        >
          {binId && binId === msgId && (
            <MdDelete onClick={deleteMessage} className="delete" />
          )}
          {message}
        </div>
      );
    case whoiam.adult && adult:
      return (
        <div className="message adult-msg">
          <strong>{displayName}: </strong>
          {message}
        </div>
      );
    case !adult:
      return (
        <div className="message sender-msg">
          <strong>{displayName} says </strong>
          {message}
        </div>
      );
    default:
      return null;
  }
}

Message.propTypes = propTypes;
export default Message;
