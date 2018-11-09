import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
    msg: PropTypes.string.isRequired,
    user: PropTypes.string.isRequired
}

function Message({ msg, user }) {
    return (
        <div style={styles.msg}>
            {user}: {msg}
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
