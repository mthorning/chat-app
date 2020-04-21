import React, {
  useReducer,
  useLayoutEffect,
  useEffect,
  useContext,
} from "react";
import { SocketContext } from "contexts";
import { Message } from "components";

function Conversation() {
  function reducer(state, action) {
    switch (action.type) {
      case "add":
        return { ...state, packets: [...state.packets, action.payload] };
      case "addHistory":
        return { ...state, packets: [...action.payload] };
      case "showBin":
        return { ...state, bin: action.payload };
      case "deleted":
        return {
          ...state,
          packets: state.packets.filter(
            (packet) => packet._id !== action.payload
          ),
        };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, { bin: null, packets: [] });

  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on("chat message", (packet) => {
      dispatch({ type: "add", payload: packet });
    });
    socket.on("adult message", (packet) => {
      dispatch({ type: "add", payload: { ...packet, adult: true } });
    });
    socket.on("message history", (history) => {
      dispatch({ type: "addHistory", payload: history });
    });
    socket.on("message deleted", (id) => {
      dispatch({ type: "deleted", payload: id });
    });
  }, []);

  let convoWrapper;
  useLayoutEffect(() => {
    convoWrapper.scrollTop = convoWrapper.scrollHeight;
  });

  function onWindowClick(e) {
    dispatch({ type: "showBin", payload: e.target.dataset.id });
  }

  useEffect(() => {
    window.addEventListener("click", onWindowClick);
    return () => window.removeEventListener("click", onWindowClick);
  }, []);

  return (
    <div className="conversation-component" ref={(el) => (convoWrapper = el)}>
      {state.packets.map((packet) => (
        <Message
          key={packet.timestamp}
          bin={[state.bin, (payload) => dispatch({ type: "showBin", payload })]}
          {...packet}
        />
      ))}
    </div>
  );
}

export default Conversation;
