import React from 'react'
import {action} from '@storybook/addon-actions'
import {EditableSpan} from './EditableSpan'

export default {
    title: 'EditableSpan Stories',
    component: EditableSpan
}

export const EditableSpanFormBaseExample = (props: any) => {
    return (<EditableSpan value={"test"} onChange={action("value changed")} />)
}
