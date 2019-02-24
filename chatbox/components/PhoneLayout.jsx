import React from 'react'
import { css } from 'emotion'
import { SessionBar, Conversation, MsgInput } from './'
import { headerColor } from '../constants'

const header = css`
    background: ${headerColor};
    width: 100%;
    height: 100px;
`
const sessionBar = css`
    h4 {
        margin-top: 0;
    }
`
const conversation = css``
const msgInput = css``

export default function PhoneLayout() {
    return (
        <div>
            <div className={header}>
                <SessionBar className={sessionBar} />
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
