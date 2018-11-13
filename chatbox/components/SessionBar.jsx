import React, { useState, useContext } from 'react'
import { MdExitToApp } from 'react-icons/md'
import { cssVariables } from 'settings'
import { UserContext } from 'components'

function SessionBar() {
    const [color, setColor] = useState(cssVariables.toolsDefaultColor)
    const { displayName } = useContext(UserContext)

    function hover() {
        setColor(cssVariables.toolsHighlightColor)
    }

    function unhover() {
        setColor(cssVariables.toolsDefaultColor)
    }

    return (
        <div style={styles.wrapper}>
            <h4 style={styles.welcome}>{displayName}</h4>
            <a style={styles.logout} href="/logout">
                <MdExitToApp
                    style={{ color }}
                    onMouseLeave={unhover}
                    onMouseEnter={hover}
                />
            </a>
        </div>
    )
}

export default SessionBar

const styles = {
    wrapper: {
        position: 'absolute',
        top: 10,
        right: 10,
        display: 'inline-flex'
    },
    logout: {
        fontSize: '30px'
    },
    welcome: {
        margin: 0,
        fontSize: '23px',
        color: cssVariables.toolsDefaultColor
    }
}
