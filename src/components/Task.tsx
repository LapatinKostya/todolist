import React, {ChangeEvent, memo, useCallback} from "react";
import {EditableSpan} from "./EditableSpan";

export type TaskPropsType = {
    id: string
    taskId: string
    isDone: boolean
    title: string
    removeTask: (toDoId: string, id: string) => void
    changeTaskStatus: (toDoId: string, id: string, isDone: boolean) => void
    changeTaskTitle: (todoId: string, taskId: string, value: string) => void
}
export const Task = memo((props: TaskPropsType) => {

    const onCheckboxHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newValue = e.currentTarget.checked
        props.changeTaskStatus(props.id, props.taskId, newValue)
    }
    const onChangeStatus = useCallback((value: string) => {
        props.changeTaskTitle(props.id, props.taskId, value)
    }, [props.changeTaskTitle, props.id, props.taskId])

    const removeTaskHandler = () => {
        props.removeTask(props.id, props.taskId)
    }

    return (
        <li key={props.taskId} className={props.isDone ? 'is-done ' : ''}>
            <button onClick={removeTaskHandler}>x</button>
            <input type="checkbox" checked={props.isDone} onChange={onCheckboxHandler}/>
            <EditableSpan title={props.title} onChange={onChangeStatus}/>
        </li>
    )
})