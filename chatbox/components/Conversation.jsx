import React, { useState } from 'react'
import io from 'socket.io-client'
import { Message } from 'components'

function Conversation() {
    const [packets, setPackets] = useState([])
    const socket = io()
    socket.on('chat message', packet => {
        console.log(packet)
        setPackets([...packets, packet])
    })
    return (
        <>
            {packets.map(packet => (
                <Message
                    key={packet.timestamp}
                    sender={packet.displayName}
                    message={packet.message}
                />
            ))}
        </>
    )
}

export default Conversation
