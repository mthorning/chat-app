import React, { useContext } from 'react'
import { MdExitToApp } from 'react-icons/md'
import { UserContext } from 'contexts'

function SessionBar({ className }) {
    const { displayName } = useContext(UserContext)

    return (
        <div className={className}>
            <h4>{displayName}</h4>
            <a href="/logout">
                <MdExitToApp />
            </a>
        </div>
    )
}

export default SessionBar
