import React, { useReducer, useEffect, useContext } from 'react'
import { SocketContext } from 'contexts'
import { Message } from 'components'

function Conversation() {
    function reducer(state, action) {
        switch (action.type) {
            case 'add':
                return { packets: [...state.packets, action.payload] }
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(reducer, { packets: [] })

    const socket = useContext(SocketContext)

    useEffect(() => {
        socket.on('chat message', packet => {
            dispatch({ type: 'add', payload: packet })
        })
        socket.on('adult message', packet => {
            dispatch({ type: 'add', payload: {...packet, adult: true } })
        })
    }, [])

    let convoWrapper
    useEffect(() => {
        convoWrapper.scrollTop = convoWrapper.scrollHeight
    })

    return (
        <div className="conversation-component" ref={el => (convoWrapper = el)}>
            {state.packets.map(packet => (
                <Message key={packet.timestamp} {...packet} />
            ))}
        </div>
    )
}

export default Conversation
