import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { UserContext } from 'contexts'

const propTypes = {
    message: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
}

function Message(props) {
    const { message, displayName, id } = props
    const whoiam = useContext(UserContext)

    if (id === whoiam.id) {
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
