import React, { useState, Fragment } from 'react'
import io from 'socket.io-client'
import { Message } from 'components'

function Conversation() {
    const [messages, setMessages] = useState([])
    const socket = io()
    socket.on('chat message', msg => {
        setMessages([...messages, msg])
    })
    return (
        <>
            {messages.map(message => (
                <Message
                    key={message.timestamp}
                    user={message.user}
                    msg={message.msg}
                />
            ))}
        </>
    )
}

export default Conversation
