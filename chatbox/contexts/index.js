import React from 'react'

export const UserContext = React.createContext({
    displayName: '',
    id: '',
    adult: false
})

export const SocketContext = React.createContext({
    on: () => null,
    emit: () => null
})
