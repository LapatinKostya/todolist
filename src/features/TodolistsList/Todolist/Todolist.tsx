import React, {useCallback, useEffect} from 'react'
import {AddItemForm} from '../../../components/AddItemForm/AddItemForm'
import {EditableSpan} from '../../../components/EditableSpan/EditableSpan'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import {Delete} from '@mui/icons-material'
import {Task} from './Task/Task'
import {FilterValuesType} from "./todolists-reducer";
import {TaskStatuses, TaskType} from "../../../api/todolists-api";
import {useAppDispatch} from "../../../app/store";
import {setTasksTC} from "./Task/tasks-reducer";
import {RequestStatusType} from "../../../app/app-reducer";

type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (todolistId: string, title: string) => void
    changeTaskStatus: (todolistId: string, taskId: string, status: TaskStatuses) => void
    changeTaskTitle: (todolistId: string, taskId: string, newTitle: string) => void
    removeTask: (todolistId: string, taskId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

export const Todolist = React.memo(function (props: PropsType) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setTasksTC(props.id))
    }, [])

    const addTask = useCallback((title: string) => {
        props.addTask(props.id, title)
    }, [props.addTask, props.id])

    const removeTodolist = () => {
        props.removeTodolist(props.id)
    }
    const changeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(props.id, title)
    }, [props.id, props.changeTodolistTitle])

    const onAllClickHandler = useCallback(() => props.changeFilter('all', props.id), [props.id, props.changeFilter])
    const onActiveClickHandler = useCallback(() => props.changeFilter('active', props.id), [props.id, props.changeFilter])
    const onCompletedClickHandler = useCallback(() => props.changeFilter('completed', props.id), [props.id, props.changeFilter])

    let tasksForTodolist = props.tasks

    if (props.filter === 'active') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.filter === 'completed') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return <div>
        <h3><EditableSpan value={props.title} onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist} disabled={props.entityStatus === 'loading'}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask} disabled={props.entityStatus === 'loading'}/>
        <div>
            {
                tasksForTodolist.map(t => <Task
                    key={t.id}
                    task={t}
                    todolistId={props.id}
                    removeTask={props.removeTask}
                    changeTaskTitle={props.changeTaskTitle}
                    changeTaskStatus={props.changeTaskStatus}
                />)
            }
        </div>
        <div style={{paddingTop: '10px'}}>
            <Button variant={props.filter === 'all' ? 'outlined' : 'text'}
                    onClick={onAllClickHandler}
                    color={'inherit'}
                    disabled={props.entityStatus === 'loading'}
            >
                All
            </Button>
            <Button variant={props.filter === 'active' ? 'outlined' : 'text'}
                    onClick={onActiveClickHandler}
                    color={'primary'}
                    disabled={props.entityStatus === 'loading'}
            >
                Active
            </Button>
            <Button variant={props.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                    color={'secondary'}
                    disabled={props.entityStatus === 'loading'}
            >
                Completed
            </Button>
        </div>
    </div>
})


