import React, {ChangeEvent, useState} from 'react';
import TextField from '@mui/material/TextField';

type EditableSpanPropsType = {
    value: string
    onChange: (newValue: string) => void
    isDisabled?: boolean
}

export const EditableSpan = React.memo(function (props: EditableSpanPropsType) {

    const [editMode, setEditMode] = useState(false);
    const [title, setTitle] = useState(props.value);


    const activateEditMode = () => {
        if(props.isDisabled) {
            return
        }
        setEditMode(true);
        setTitle(props.value);
    }
    const activateViewMode = () => {
        setEditMode(false);
        props.onChange(title);
    }
    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    return editMode
        ? <TextField
            value={title}
            onChange={changeTitle}
            onBlur={activateViewMode}
            autoFocus
        />
        : <span onDoubleClick={activateEditMode}>{props.value}</span>
});
