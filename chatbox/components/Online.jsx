import React, { useEffect, useReducer, useContext } from 'react'
import { SocketContext, UserContext } from 'contexts'

function Online() {
    const { displayName } = useContext(UserContext)
    function reducer(state, action) {
        switch (action.type) {
            case 'update':
                return {
                    onlineUsers: action.payload.filter(
                        usr => usr !== displayName
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
