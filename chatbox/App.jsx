import React, { useEffect, useState } from "react";
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

function App() {
  const [whoami, setWhoami] = useState({});

  useEffect(() => {
    fetch("/whoami")
      .then((res) => {
        if (res.status === 404) window.location.href = "/login";
        return res.json();
      })
      .then((whoiam) => {
        setWhoami(whoiam);
        socket.emit("user connected", {
          timestamp: Date.now(),
          displayName: whoiam.displayName,
          id: whoiam.id,
        });
      })
      .catch((error) => console.error(error));
  }, []);

  return (
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
  );
}

export default App;
