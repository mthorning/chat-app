import React, { useState } from 'react'
import { css } from 'emotion'
import {
    headerColor,
    headerSecondaryColor,
    phoneMenuHeight
} from '../constants'
import { MenuButton } from './'

const header = css`
    padding: 0 8px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgb(${headerColor});
    height: ${phoneMenuHeight}px;
`
const brand = css`
    font-family: monospace;
    font-size: 22px;
    color: rgb(${headerSecondaryColor});
`
const dropdown = css`
    position: absolute;
    top: ${phoneMenuHeight}px;
    left: 0;
    right: 0;
    background: rgba(${headerColor}, 0.2);
`
export default function PhoneMenu() {
    const [menuOpen, setMenuOpen] = useState(false)

    function DropdownMenu() {
        const height = menuOpen ? ' calc(100vh - ' + phoneMenuHeight + 'px)' : 0
        return (
            <div
                className={css`
                    ${dropdown}
                    height: ${height};
                `}
            />
        )
    }

    function onMenuClick() {
        setMenuOpen(!menuOpen)
    }
    return (
        <div className={header}>
            <span className={brand}>SquishyChat</span>
            <MenuButton clickHandler={onMenuClick} />
            <DropdownMenu key={menuOpen} />
        </div>
    )
}
