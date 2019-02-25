import React from 'react'
import { css } from '@emotion/core'

const menuButton = theme => css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    padding: 1px;
    height: 25px;
    width: 25px;
    border-radius: 4px;
    border: 1px solid rgb(${theme.headerSecondaryColor});
`
const menuBars = theme => css`
    background: rgb(${theme.headerSecondaryColor});
    border-radius: 4px;
    margin: 2px;
    height: 2px;
`
export default function MenuButton({ clickHandler }) {
    return (
        <div css={menuButton} onClick={clickHandler}>
            <div css={menuBars} />
            <div css={menuBars} />
            <div css={menuBars} />
        </div>
    )
}
