import React, { useEffect, useState } from 'react'

import { MsgInput, Conversation, SessionBar, UserContext } from 'components'
import { cssVariables } from 'settings'

function App() {
    const [whoami, setWhoami] = useState({})

    useEffect(async () => {
        const res = await fetch('/whoami')
        const whoiam = await res.json()
        setWhoami(whoiam)
    }, [])

    return (
        <UserContext.Provider value={whoami}>
            <div style={styles.app}>
                <SessionBar />
                <div style={styles.chatContainer}>
                    <Conversation />
                    <MsgInput />
                </div>
            </div>
        </UserContext.Provider>
    )
}

export default App

const styles = {
    app: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    chatContainer: {
        height: '80%',
        width: '75%',
        border: cssVariables.basicBorder.shorthand,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '400px'
    }
}
