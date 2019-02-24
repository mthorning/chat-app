import React from 'react'
import { css } from 'emotion'
import { Conversation, MsgInput, PhoneMenu } from './'
import { headerColor, phoneMenuHeight, phoneMsgInputHeight } from '../constants'

const container = css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    height: 100vh;
    width: 100vw;
`
const header = css`
    flex: 0 0 ${phoneMenuHeight}px;
`
const sessionBar = css`
    h4 {
        margin-top: 0;
    }
`
const conversation = css`
    flex: 1 1 auto;
`
const msgInput = css`
    flex: 0 0 ${phoneMsgInputHeight}px;
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
        <div className={container}>
            <div className={header}>
                <PhoneMenu />
            </div>
            <div className={conversation}>
                <Conversation />
            </div>
            <div className={msgInput}>
                <MsgInput />
            </div>
        </div>
    )
}
