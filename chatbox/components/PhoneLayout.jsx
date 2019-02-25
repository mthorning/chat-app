import React from 'react'
import { css } from '@emotion/core'
import { Conversation, MsgInput, PhoneMenu } from './'

const container = css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    height: 100vh;
    width: 100vw;
`
const header = theme => css`
    flex: 0 0 ${theme.phone.menuHeight}px;
`
const sessionBar = css`
    h4 {
        margin-top: 0;
    }
`
const conversation = css`
    flex: 1 1 auto;
`
const msgInput = theme => css`
    flex: 0 0 ${theme.phone.msgInputHeight}px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    textarea {
        height: 100%;
        padding: 0 5px;
    }
`

export default function PhoneLayout() {
    return (
        <div css={container}>
            <div css={header}>
                <PhoneMenu />
            </div>
            <div css={conversation}>
                <Conversation />
            </div>
            <div css={msgInput}>
                <MsgInput />
            </div>
        </div>
    )
}
