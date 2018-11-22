import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { UserContext } from 'contexts'

const propTypes = {
    message: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired
}

function Message(props) {
    const { message, displayName, username } = props
    const whoiam = useContext(UserContext)

    if (username === whoiam.username) {
        return <div className="message own-msg">{message}</div>
    } else {
        return (
            <div className="message sender-msg">
                <strong>{displayName} says </strong>
                {message}
            </div>
        )
    }
}

Message.propTypes = propTypes
export default Message
