import React, { useReducer, useEffect } from 'react'
import io from 'socket.io-client'
import { Message } from 'components'

const socket = io()

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

    useEffect(() => {
        socket.on('chat message', packet => {
            dispatch({ type: 'add', payload: packet })
        })
    }, [])

    let convoWrapper
    useEffect(() => {
        convoWrapper.scrollTop = convoWrapper.scrollHeight
    })

    return (
        <div ref={el => (convoWrapper = el)} style={styles.wrapper}>
            {state.packets.map(packet => (
                <Message key={packet.timestamp} {...packet} />
            ))}
        </div>
    )
}

export default Conversation

const styles = {
    wrapper: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        overflow: 'auto'
    }
}
