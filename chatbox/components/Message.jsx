import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
    message: PropTypes.string.isRequired,
    sender: PropTypes.string.isRequired
}

function Message({ message, sender }) {
    return (
        <div style={styles.msg}>
            {sender}: {message}
        </div>
    )
}

const styles = {
    msg: {
        width: '100%'
    }
}

Message.propTypes = propTypes
export default Message
