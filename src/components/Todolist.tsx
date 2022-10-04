import React, {memo, useCallback} from "react";
import {filterType} from "../App";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Task} from "./Task";

type TodolistPropsType = {
    id: string
    title: string
    changeFilter: (value: filterType, toDoId: string) => void
    filter: filterType
    removeTodolist: (todoId: string) => void
    changeTodolistTitle: (todoId: string, value: string) => void
    tasks: TasksType[]
    removeTask: (toDoId: string, id: string) => void
    addTask: (toDoId: string, task: string) => void
    changeTaskStatus: (toDoId: string, id: string, isDone: boolean) => void
    changeTaskTitle: (todoId: string, taskId: string, value: string) => void
}

export type TasksType = {
    id: string
    title: string
    isDone: boolean
}

export const Todolist = memo((props: TodolistPropsType) => {

    let tasksForTodolist = props.tasks

    if (props.filter === 'active') {
        tasksForTodolist = props.tasks.filter(el => !el.isDone)
    }
    if (props.filter === 'completed') {
        tasksForTodolist = props.tasks.filter(el => el.isDone)
    }

    const addTaskHandler = useCallback((title: string) => {
        props.addTask(props.id, title)
    }, [props.addTask, props.id])


    const onChangeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(props.id, title)
    }, [props.changeTodolistTitle, props.id])

    const removeTodolist = () => {
        props.removeTodolist(props.id)
    }

    const onClickAll = useCallback(() => {
        props.changeFilter('all', props.id)
    }, [props.changeFilter, props.id])
    const onClickActive = useCallback(() => {
        props.changeFilter('active', props.id)
    }, [props.changeFilter, props.id])
    const onClickCompleted = useCallback(() => {
        props.changeFilter('completed', props.id)
    }, [props.changeFilter, props.id])

    return (
        <div>
            <h3>
                <EditableSpan title={props.title} onChange={onChangeTodolistTitle}/>
                <button onClick={removeTodolist}>x</button>
            </h3>

            <div>
                <AddItemForm addItem={addTaskHandler}/>
            </div>
            <ul>
                {tasksForTodolist.map(el => <Task
                    key={el.id}
                    id={props.id}
                    taskId={el.id}
                    title={el.title}
                    isDone={el.isDone}
                    changeTaskTitle={props.changeTaskTitle}
                    removeTask={props.removeTask}
                    changeTaskStatus={props.changeTaskStatus}

                />)}
            </ul>
            <div>
                <button className={props.filter === 'all' ? 'active-filter' : ''}
                        onClick={onClickAll}>All
                </button>
                <button className={props.filter === 'active' ? 'active-filter' : ''}
                        onClick={onClickActive}>Active
                </button>
                <button className={props.filter === 'completed' ? 'active-filter' : ''}
                        onClick={onClickCompleted}>Completed
                </button>
            </div>
        </div>
    )
})

