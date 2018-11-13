import React, { useEffect, createContext, useState } from 'react'
import { MsgInput, Conversation, SessionBar } from 'components'
import { cssVariables } from 'settings'

const UserContext = createContext('')

function App() {
    const [name, setName] = useState('')

    useEffect(() => {
        fetch('/whoami')
            .then(res => res.json().then(val => setName(val.user)))
            .catch(err => console.error(err))
    }, [])

    return (
        <UserContext.Provider value="matt">
            <div style={styles.app}>
                <SessionBar name={name} />
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
        position: 'relative'
    }
}
