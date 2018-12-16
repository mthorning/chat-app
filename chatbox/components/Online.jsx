import React, { useEffect, useReducer, useContext } from 'react'
import { SocketContext, UserContext } from 'contexts'

function Online() {
    const { id } = useContext(UserContext)
    function reducer(state, action) {
        switch (action.type) {
            case 'update':
                return {
                    onlineUsers: action.payload.filter(
                        user => user._id !== id
                    )
                }
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

    return (
        <div className="online-component">
            <ul>
                {state.onlineUsers.map(user => (
                    <li key={user._id}>{user.displayName}</li>
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
