import React, { useContext } from "react";
import { MdExitToApp } from "react-icons/md";
import { UserContext } from "contexts";

function SessionBar() {
    const { displayName } = useContext(UserContext);

    return (
        <div className="session-bar-component">
            <h4 className="display-name">{displayName}</h4>
            <a className="logout" href="/logout">
                <MdExitToApp />
            </a>
        </div>
    );
}

export default SessionBar;
