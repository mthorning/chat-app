import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { MdExitToApp } from 'react-icons/md'
import { cssVariables } from 'settings'

const propTypes = {
    name: PropTypes.string.isRequired
}

function SessionBar() {
    const defaultColor = '#fa09cf6b'
    const hoverColor = '#fa09cf'
    const [color, setColor] = useState(cssVariables.toolsDefaultColor)

    function hover() {
        setColor(cssVariables.toolsHighlightColor)
    }

    function unhover() {
        setColor(cssVariables.toolsDefaultColor)
    }

    return (
        <a style={styles.logout} href="/logout">
            <MdExitToApp
                style={{ color }}
                onMouseLeave={unhover}
                onMouseEnter={hover}
            />
        </a>
    )
}

SessionBar.propTypes = propTypes
export default SessionBar

const styles = {
    logout: {
        position: 'absolute',
        top: 10,
        right: 10,
        display: 'block',
        fontSize: '30px'
    },
    welcome: {
        position: 'absolute',
        top: 10,
        left: 10,
        margin: 0
    }
}
