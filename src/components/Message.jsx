import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
    msg: PropTypes.string.isRequired
}

function Message({ msg }) {
    return (
        <div key={msg} style={styles.msg}>
            {msg}
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
