import React, { useState, useContext } from 'react'
import { UserContext, SocketContext } from 'contexts'

function MsgInput() {
    const [msg, setMsg] = useState('')
    const { username, displayName } = useContext(UserContext)
    const socket = useContext(SocketContext)

    function inputHandler(e) {
        if (e.which === 13) {
            e.preventDefault()
            const message = e.target.value
            const timestamp = Date.now()
            socket.emit('chat message', {
                message,
                timestamp,
                username,
                displayName
            })
            setMsg('')
        }
    }

    function changeHandler(e) {
        setMsg(e.target.value)
    }

    return (
        <div className="msg-input-component">
            <textarea
                autoFocus
                value={msg}
                onChange={changeHandler}
                onKeyPress={inputHandler}
            />
        </div>
    )
}

export default MsgInput
