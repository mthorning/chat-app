import React from 'react'
import { css } from 'emotion'
import { headerSecondaryColor } from '../constants'

const menuButton = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    padding: 1px;
    height: 25px;
    width: 25px;
    border-radius: 4px;
    border: 1px solid rgb(${headerSecondaryColor});
`
const menuBars = css`
    background: rgb(${headerSecondaryColor});
    border-radius: 4px;
    margin: 2px;
    height: 2px;
`
export default function MenuButton({ clickHandler }) {
    return (
        <div className={menuButton} onClick={clickHandler}>
            <div className={menuBars} />
            <div className={menuBars} />
            <div className={menuBars} />
        </div>
    )
}
