import React, { useEffect } from 'react'
import io from 'socket.io-client'

function ChatInput(props) {
    let socket
    useEffect(() => (socket = io()))
    function inputHandler(e) {
        if (e.which === 13) {
            io.emit('')
        }
    }

    return <input autoFocus onKeyPress={inputHandler} />
}

export default ChatInput
