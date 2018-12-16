import React from 'react'

export const UserContext = React.createContext({
    displayName: '',
    id: ''
})

export const SocketContext = React.createContext({
    on: () => null,
    emit: () => null
})
