import React, { useEffect } from "react";
import "assets/main.scss";
import { UserContext, SocketContext } from "contexts";
import { MsgInput, Conversation, SessionBar, Online } from "components";
import io from "socket.io-client";

const socket = io();
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((registrationError) => {
      console.log("SW registration failed: ", registrationError);
    });
  });
}

function App({ whoami }) {
  useEffect(() => {
    if (whoami) {
      socket.emit("user connected", {
        timestamp: Date.now(),
        displayName: whoami.displayName,
        id: whoami.id,
      });
    }
  }, [whoami]);

  return (
    <div className="wrapper">
      <UserContext.Provider value={whoami}>
        <SessionBar />
        <div className="app-area">
          <SocketContext.Provider value={socket}>
            <Online />
            <div className="chat-area-wrapper">
              <div className="chat-area">
                <Conversation />
                <MsgInput />
              </div>
            </div>
          </SocketContext.Provider>
        </div>
      </UserContext.Provider>
    </div>
  );
}

export default App;
