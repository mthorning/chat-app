import React, { useState, useContext, useEffect } from 'react'
import io from 'socket.io-client'
import { cssVariables } from 'settings'
import { UserContext } from 'components'

const socket = io()

function MsgInput() {
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
        <textarea
            autoFocus
            value={msg}
            style={styles.input}
            onChange={changeHandler}
            onKeyPress={inputHandler}
        />
    )
}

export default MsgInput

const styles = {
    input: {
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
