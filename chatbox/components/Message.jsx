import React, { useContext } from 'react'
import { UserContext } from 'contexts'
import PropTypes from 'prop-types'

const propTypes = {
    message: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired
}

function Message(props) {
    const { message, displayName, username } = props
    const { username: whoiam } = useContext(UserContext)
    const align =
        whoiam === username
            ? { alignSelf: 'flex-end', borderRadius: '10px 0 10px 10px' }
            : { alignSelf: 'flex-start', borderRadius: '0 10px 10px 10px' }
    return (
        <div className="message" style={align}>
            {displayName}: {message}
        </div>
    )
}

Message.propTypes = propTypes
export default Message
