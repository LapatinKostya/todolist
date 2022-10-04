import React, {ChangeEvent, KeyboardEvent, memo, useState} from "react";

type EditableSpanPropsType = {
    title: string
    onChange: (newValue: string) => void
}
export const EditableSpan = memo((props: EditableSpanPropsType) => {

    const [edit, setEdit] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('')

    const offEdit = () => {
        setEdit(false)
        props.onChange(title)
    }

    const onEdit = () => {
        setEdit(true)
        setTitle(props.title)
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }
    const onEnter = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setTitle(title.trim())
            offEdit()
        }
    }

    return (
        edit ?
            <input
                value={title}
                autoFocus
                onBlur={offEdit}
                onChange={onChangeHandler}
                onKeyDown={onEnter}
            />
            :
            <span
                onDoubleClick={onEdit}
            >{props.title}</span>
    )
})