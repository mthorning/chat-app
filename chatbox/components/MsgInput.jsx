import React, { useState, useContext } from 'react'
import { UserContext, SocketContext } from 'contexts'
import { css } from 'emotion'
import { adultSymbol } from '../constants'

function MsgInput({ className }) {
    const [msg, setMsg] = useState('')
    const { id, displayName, adult } = useContext(UserContext)
    const socket = useContext(SocketContext)

    function inputHandler(e) {
        if (e.which === 13) {
            e.preventDefault()
            const [msgType, message] = newMessage(e.target.value)
            const timestamp = Date.now()
            if (message.length) {
                socket.emit(msgType, {
                    message,
                    timestamp,
                    id,
                    displayName
                })
                setMsg('')
            }
        }
    }

    function newMessage(message) {
        if (adult && message.charAt(0) === adultSymbol) {
            return ['adult message', message.substring(1).trim()]
        }
        return ['chat message', message.trim()]
    }

    function changeHandler(e) {
        setMsg(e.target.value)
    }

    return (
        <textarea
            autoFocus
            className={css`
                background: rgba(200, 200, 200, 0.1);
            `}
            value={msg}
            onChange={changeHandler}
            onKeyPress={inputHandler}
        />
    )
}

export default MsgInput
