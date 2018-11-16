import React, { useEffect, useState } from 'react'
import 'assets/main.scss'
import { UserContext, SocketContext } from 'contexts'
import { MsgInput, Conversation, SessionBar, Online } from 'components'
import io from 'socket.io-client'

const socket = io()

function App() {
    const [whoami, setWhoami] = useState({})

    useEffect(async () => {
        const res = await fetch('/whoami')
        const whoiam = await res.json()
        setWhoami(whoiam)
        socket.emit('user connected', {
            timestamp: Date.now(),
            displayName: whoiam.displayName,
            username: whoiam.username
        })

        return () => {
            socket.emit('user disconnected', {
                timestamp: Date.now(),
                username,
                displayName
            })
        }
    }, [])

    return (
        <UserContext.Provider value={whoami}>
            <div className="app-area">
                <SessionBar />
                <SocketContext.Provider value={socket}>
                    <Online />
                    <div className="chat-area">
                        <Conversation />
                        <MsgInput />
                    </div>
                </SocketContext.Provider>
            </div>
        </UserContext.Provider>
    )
}

export default App
