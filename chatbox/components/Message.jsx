import React, { useContext } from "react";
import PropTypes from "prop-types";
import { UserContext, SocketContext } from "contexts";
import { MdDelete } from "react-icons/md";
import anchorme from "anchorme";
import { sanitize } from "dompurify";

const propTypes = {
  message: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

function FormattedMessage({ msgId, message, img }) {
  return img ? (
    <img data-id={msgId} src={message} />
  ) : (
    <span
      data-id={msgId}
      dangerouslySetInnerHTML={{ __html: sanitize(anchorme(message)) }}
    />
  );
}

function Message(props) {
  const { _id: msgId, message, displayName, id, adult, img, bin } = props;
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
          <FormattedMessage {...{ msgId, img, message }} />
        </div>
      );
    case whoiam.adult && adult:
      return (
        <div className="message adult-msg">
          <strong>{displayName}: </strong>
          <FormattedMessage {...{ msgId, img, message }} />
        </div>
      );
    case !adult:
      return (
        <div className="message sender-msg">
          <strong>{displayName} says </strong>
          <FormattedMessage message={message} />
        </div>
      );
    default:
      return null;
  }
}

Message.propTypes = propTypes;
export default Message;
