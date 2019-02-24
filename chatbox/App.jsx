import React, { useEffect, useState } from 'react'
import { UserContext, SocketContext } from 'contexts'
import { PhoneLayout } from 'components'
import io from 'socket.io-client'

const socket = io()

function App() {
    const [whoami, setWhoami] = useState({})

    async function getWhoiam() {
        const res = await fetch('/whoami')
        const whoiam = await res.json()
        setWhoami(whoiam)
        socket.emit('user connected', {
            timestamp: Date.now(),
            displayName: whoiam.displayName,
            id: whoiam.id
        })
    }

    useEffect(async () => {
        getWhoiam()
    }, [])

    return (
        <UserContext.Provider value={whoami}>
            <SocketContext.Provider value={socket}>
                <PhoneLayout />
            </SocketContext.Provider>
        </UserContext.Provider>
    )
}

export default App
