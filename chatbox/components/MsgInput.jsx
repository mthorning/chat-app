import React, { useState, useContext } from 'react'
import io from 'socket.io-client'
import { cssVariables } from 'settings'
import { UserContext } from 'components'

function ChatInput() {
    const socket = io()
    const [msg, setMsg] = useState('')
    const { username, displayName } = useContext(UserContext)

    function inputHandler(e) {
        if (e.which === 13) {
            e.preventDefault()
            const message = e.target.value
            const timestamp = Date.now()
            socket.emit('chat message', {
                message,
                timestamp,
                sender: {
                    username,
                    displayName
                }
            })
            setMsg('')
        }
    }

    function changeHandler(e) {
        setMsg(e.target.value)
    }

    return (
        <textarea
            autoFocus
            value={msg}
            style={styles.input}
            onChange={changeHandler}
            onKeyPress={inputHandler}
        />
    )
}

export default ChatInput
const styles = {
    input: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        borderTop: cssVariables.basicBorder.shorthand,
        borderBottom: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        width: `calc(100% - ${cssVariables.basicBorder.size + 5}px)`,
        height: '10vh',
        verticalAlign: 'text-top',
        padding: '3px',
        resize: 'none'
    }
}
