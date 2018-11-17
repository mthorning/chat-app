import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
    message: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired
}

function Message(props) {
    const { message, displayName, type } = props

    if (type === 'own') {
        return <div className="message own-msg">{message}</div>
    } else {
        return (
            <div className="message sender-msg">
                {displayName}: {message}
            </div>
        )
    }
}

Message.propTypes = propTypes
export default Message
