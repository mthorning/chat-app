import React, { useState } from 'react'
import { css } from '@emotion/core'
import { MenuButton } from './'

const header = theme => css`
    padding: 0 8px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgb(${theme.headerColor});
    height: ${theme.phone.menuHeight}px;
`
const brand = theme => css`
    font-family: monospace;
    font-size: 22px;
    color: rgb(${theme.headerSecondaryColor});
`
const dropdown = theme => css`
    position: absolute;
    top: ${theme.phone.menuHeight}px;
    left: 0;
    right: 0;
    background: rgba(${theme.headerColor}, 0.2);
`
export default function PhoneMenu() {
    const [menuOpen, setMenuOpen] = useState(false)

    function DropdownMenu() {
        return (
            <div
                css={theme => css`
                    ${dropdown(theme)}
                    height: ${
                        menuOpen
                            ? ' calc(100vh - ' + theme.phone.menuHeight + 'px)'
                            : 0
                    };
                `}
            />
        )
    }

    function onMenuClick() {
        setMenuOpen(!menuOpen)
    }
    return (
        <div css={header}>
            <span css={brand}>SquishyChat</span>
            <MenuButton clickHandler={onMenuClick} />
            <DropdownMenu key={menuOpen} />
        </div>
    )
}
