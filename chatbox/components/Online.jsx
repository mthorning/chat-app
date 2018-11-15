import React, { useEffect, useReducer, useContext } from 'react'
import { UserContext, SocketContext } from 'contexts'

function Online() {
    function reducer(state, action) {
        switch (action.type) {
            case 'online':
                const online = {
                    packets: [...new Set([...state.packets, action.payload])]
                }
                return online
            case 'offline':
                const offline = {
                    packets: state.packets.filter(
                        packet => packet.username !== action.payload.username
                    )
                }
                console.log(offline)
                return offline
            default:
                return state
        }
    }
    const { username, displayName } = useContext(UserContext)
    const [state, dispatch] = useReducer(reducer, { packets: [] })
    const socket = useContext(SocketContext)

    useEffect(() => {
        socket.on('user connected', packet => {
            dispatch({ type: 'online', payload: packet })
        })

        socket.on('user disconnected', packet => {
            dispatch({ type: 'offline', payload: packet })
        })
    }, [])

    return (
        <div className="online-component">
            <ul>
                {state.packets.map(packet => (
                    <li key={packet.timestamp}>{packet.displayName}</li>
                ))}
            </ul>
        </div>
    )
}

export default Online

const styles = {
    wrapper: {
        width: '100px'
    }
}
