import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { UserContext } from 'contexts'

const propTypes = {
    message: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
}

function Message(props) {
    const { message, displayName, id, adult } = props
    const whoiam = useContext(UserContext)

    switch (true) {
        case id === whoiam.id && adult:
            return <div className="message own-adult-msg">{message}</div>
        case id === whoiam.id:
            return <div className="message own-msg">{message}</div>
        case whoiam.adult && adult:
            return (
                <div className="message adult-msg">
                    <strong>{displayName}: </strong>
                    {message}
                </div>
            )
        case !adult:
            return (
                <div className="message sender-msg">
                    <strong>{displayName} says </strong>
                    {message}
                </div>
            )
        default:
            return null;
    }
}

Message.propTypes = propTypes
export default Message
