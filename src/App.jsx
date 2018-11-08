import React from 'react'
import { ChatInput } from 'components'

export default function App() {
    return (
        <div style={styles.app}>
            <div style={styles.chatContainer}>
                <ChatInput />
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
        border: '1px solid #aaa',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    }
}
