import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";
import { UserContext, SocketContext } from "contexts";
import { IoMdHappy } from "react-icons/io";
import { Picker } from "emoji-mart";

const adultSymbol = "#";

function EmojiPicker({
  inputPosition: { rightEdge, topEdge },
  showEmojis,
  setShowEmojis,
  addEmoji,
}) {
  const pickerRef = useRef();

  const closePicker = (e) => {
    if (pickerRef.current && !pickerRef.current.contains(e.target))
      setShowEmojis(false);
  };

  useEffect(() => {
    window.addEventListener("click", closePicker);
    return () => window.removeEventListener("click", closePicker);
  }, []);

  return (
    <>
      {showEmojis ? (
        <div ref={pickerRef}>
          <Picker
            autoFocus
            style={{
              bottom: `${topEdge + 10}px`,
              right: `${rightEdge + 10}px`,
            }}
            showSkinTones={false}
            onSelect={addEmoji}
          />
        </div>
      ) : null}
    </>
  );
}

function useMsgInputPosition() {
  const [inputPosition, setInputPosition] = useState({});
  const inputRef = useRef();
  function updateInputPosition() {
    if (inputRef.current) {
      const positions = inputRef.current?.getBoundingClientRect();
      setInputPosition({
        rightEdge: window.innerWidth - positions.right,
        topEdge: window.innerHeight - positions.top,
      });
    }
  }

  useEffect(() => {
    updateInputPosition();
    window.addEventListener("resize", updateInputPosition);
    return () => window.removeEventListener("resize", updateInputPosition);
  }, []);

  return [inputPosition, inputRef];
}

function MsgInput() {
  const [msg, setMsg] = useState("");
  const { id, displayName, adult } = useContext(UserContext);
  const socket = useContext(SocketContext);
  const textareaRef = useRef();
  const [inputPosition, inputRef] = useMsgInputPosition();
  const [showEmojis, setShowEmojis] = useState(false);

  function inputHandler(e) {
    if (e.which === 13) {
      e.preventDefault();
      const [msgType, message] = newMessage(e.target.value);
      const timestamp = Date.now();
      if (message.length) {
        socket.emit(msgType, {
          message,
          timestamp,
          id,
          displayName,
        });
        setShowEmojis(false);
        setMsg("");
      }
    }
  }

  function newMessage(message) {
    if (adult && message.charAt(0) === adultSymbol) {
      return ["adult message", message.substring(1).trim()];
    }
    return ["chat message", message.trim()];
  }

  function changeHandler(e) {
    setMsg(e.target.value);
  }

  function addEmoji({ native: emoji }) {
    setMsg((msg) => msg + emoji);
    setShowEmojis(false);
    textareaRef.current.focus();
  }

  return (
    <>
      <EmojiPicker
        {...{ inputPosition, showEmojis, setShowEmojis, addEmoji }}
      />
      <div ref={inputRef} className="msg-input-component">
        <textarea
          ref={textareaRef}
          autoFocus
          value={msg}
          onChange={changeHandler}
          onKeyPress={inputHandler}
        />
        <IoMdHappy
          onClick={(e) => {
            e.stopPropagation();
            setShowEmojis((show) => !show);
          }}
          className="emoji-icon"
        />
      </div>
    </>
  );
}

export default MsgInput;
