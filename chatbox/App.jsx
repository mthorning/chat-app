import React from 'react'
import { MsgInput, Conversation } from 'components'
import { cssVariables } from 'settings'

export default function App() {
    return (
        <div style={styles.app}>
            <a href="/logout">Logout</a>
            <div style={styles.chatContainer}>
                <Conversation />
                <MsgInput />
            </div>
        </div>
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
