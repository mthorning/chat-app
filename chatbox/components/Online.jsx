import React, { useEffect, useState, useContext } from "react";
import { SocketContext, UserContext } from "contexts";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

function Online() {
  const { id } = useContext(UserContext);
  const socket = useContext(SocketContext);
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socket.on("online users", (onlineUsers) => {
      setOnlineUsers(onlineUsers.filter((user) => user._id !== id));
    });
  }, [id, onlineUsers, setOnlineUsers]);

  useEffect(() => {
    setTimeout(() => setIsOpen(open), 350);
  }, [open, setIsOpen]);

  const onClick = () => setOpen((o) => !o);

  return (
    <div className={`online-component ${open ? "open" : "closed"}`}>
      {isOpen ? (
        <>
          <MdKeyboardArrowLeft onClick={onClick} className="arrow" />
          {open && (
            <ul>
              {onlineUsers.map((user) => (
                <li key={user._id}>{user.displayName}</li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <MdKeyboardArrowRight onClick={onClick} className="arrow" />
      )}
    </div>
  );
}

export default Online;

const styles = {
  wrapper: {
    width: "100px",
  },
};
