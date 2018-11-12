import React, { useEffect, createContext } from 'react'
import { MsgInput, Conversation } from 'components'
import { cssVariables } from 'settings'

const UserContext = createContext('')

export default function App() {
    useEffect(() => {
        fetch('/whoami')
            .then(res => console.log(res))
            .catch(err => console.error(err))
    })
    return (
        <UserContext.Provider value="matt">
            <div style={styles.app}>
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
    }
}
