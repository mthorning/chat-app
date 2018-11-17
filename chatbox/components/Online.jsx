import React, { useEffect, useReducer, useContext } from 'react'
import { SocketContext } from 'contexts'

function Online() {
    function reducer(state, action) {
        switch (action.type) {
            case 'update':
                return { onlineUsers: action.payload }
            default:
                return state
        }
    }
    const [state, dispatch] = useReducer(reducer, { onlineUsers: [] })
    const socket = useContext(SocketContext)

    useEffect(() => {
        socket.on('online users', onlineUsers => {
            dispatch({ type: 'update', payload: onlineUsers })
        })
    }, [])

    console.log('users: ', state.onlineUsers)
    return (
        <div className="online-component">
            <ul>
                {state.onlineUsers.map(user => (
                    <li key={user}>{user}</li>
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
