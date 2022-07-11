import React, {ChangeEvent, KeyboardEvent, useState} from "react";

type AddItemFormPropsType = {
    addItem: (task: string) => void
}
export const AddItemForm = (props: AddItemFormPropsType) => {
    const [error, setError] = useState<string>('')
    const [task, setTask] = useState<string>('')

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setError('')
        setTask(e.currentTarget.value)
    }

    const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onClickHandler()
        }
    }

    const onClickHandler = () => {
        let trimmedTask = task.trim()
        if (trimmedTask) {
            props.addItem(trimmedTask)
            setTask('')
            setError('')
        } else {
            setError('Should be required')
        }
    }

    return (
        <div>
            <input
                className={error ? 'error' : ''}
                value={task} onChange={onChangeHandler}
                onKeyDown={onKeyPress}
            />
            <button onClick={onClickHandler}>+</button>
            {error && <div className={'error-message'}>{error}</div>}
        </div>
    )
}