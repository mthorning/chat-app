import React from 'react'

export const UserContext = React.createContext({
    displayName: '',
    username: ''
})

export const SocketContext = React.createContext({
    on: () => null,
    emit: () => null
})
