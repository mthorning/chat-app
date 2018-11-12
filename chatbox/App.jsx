import React, { useEffect, createContext, useState } from 'react'
import { MsgInput, Conversation } from 'components'
import { cssVariables } from 'settings'

const UserContext = createContext('')

export default function App() {
    const [name, setName] = useState('')

    useEffect(() => {
        fetch('/whoami')
            .then(res => res.json().then(val => setName(val.user)))
            .catch(err => console.error(err))
    }, [])

    return (
        <UserContext.Provider value="matt">
            <div style={styles.app}>
                <a style={styles.logout} href="/logout">
                    Logout
                </a>
                <h3 style={styles.welcome}>Welcome, {name}</h3>
                <div style={styles.chatContainer}>
                    <Conversation />
                    <MsgInput />
                </div>
            </div>
        </UserContext.Provider>
    )
}

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
    },
    logout: {
        position: 'absolute',
        top: 10,
        right: 10
    },
    welcome: {
        position: 'absolute',
        top: 10,
        left: 10
    }
}
