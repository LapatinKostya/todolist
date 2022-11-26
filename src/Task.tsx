import React, {ChangeEvent, useCallback} from 'react'
import {EditableSpan} from './EditableSpan'
import {Delete} from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import {TaskPriorities, TaskType} from "./api/todolists-api";

type TaskPropsType = {
    task: TaskType
    todolistId: string
    changeTaskStatus: (todolistId: string, id: string, status: TaskPriorities) => void
    changeTaskTitle: (todolistId: string, taskId: string, newTitle: string) => void
    removeTask: (todolistId: string, taskId: string) => void
}
export const Task = React.memo((props: TaskPropsType) => {
    const onClickHandler = useCallback(() => props.removeTask(props.todolistId, props.task.id), [props.task.id, props.todolistId]);

    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const newIsDoneValue = e.currentTarget.checked ? TaskPriorities.Completed : TaskPriorities.New
        props.changeTaskStatus(props.todolistId, props.task.id, newIsDoneValue)
    }, [props.task.id, props.todolistId]);

    const onTitleChangeHandler = useCallback((newValue: string) => {
        props.changeTaskTitle(props.todolistId, props.task.id, newValue)
    }, [props.task.id, props.todolistId]);

    return <div key={props.task.id} className={props.task.status === TaskPriorities.Completed ? 'is-done' : ''}>
        <Checkbox
            checked={props.task.status === TaskPriorities.Completed}
            color="primary"
            onChange={onChangeHandler}
        />

        <EditableSpan value={props.task.title} onChange={onTitleChangeHandler}/>
        <IconButton onClick={onClickHandler}>
            <Delete/>
        </IconButton>
    </div>
})
