import React, { useContext } from 'react'
import { UserContext } from 'components'
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
        <div style={Object.assign({}, styles.msg, align)}>
            {displayName}: {message}
        </div>
    )
}

const styles = {
    msg: {
        width: '50%',
        border: '1px solid #aaa',
        padding: '10px',
        margin: '10px 10px'
    }
}

Message.propTypes = propTypes
export default Message
