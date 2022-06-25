import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {filterType} from "../App";

type TodolistPropsType = {
    id: string
    title: string
    tasks: Array<TasksType>
    removeTask: (toDoId: string, id: string) => void
    changeFilter: (value: filterType, toDoId: string) => void
    addTask: (toDoId: string, task: string) => void
    changeTaskStatus: (toDoId: string, id: string, isDone: boolean) => void
    filter: filterType
    removeTodolist: (todoId: string) => void
}

type TasksType = {
    id: string
    title: string
    isDone: boolean
}

export const Todolist = (props: TodolistPropsType) => {

    const [task, setTask] = useState<string>('')
    const [error, setError] = useState<string>('')

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setError('')
        setTask(e.currentTarget.value)
    }
    const onClickHandler = () => {
        let trimmedTask = task.trim()
        if (trimmedTask) {
            props.addTask(props.id, trimmedTask)
            setTask('')
            setError('')
        } else {
            setError('Should be required')
        }
    }
    const onClickAll = () => {
        props.changeFilter('all', props.id)
    }
    const onClickActive = () => {
        props.changeFilter('active', props.id)
    }
    const onClickCompleted = () => {
        props.changeFilter('completed', props.id)
    }
    const removeTaskHandler = (id: string) => {
        props.removeTask(props.id, id)
    }
    const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onClickHandler()
        }
    }
    const removeTodolist = () => {
        props.removeTodolist(props.id)
    }
    return (
        <div>
            <h3>{props.title}
                <button onClick={removeTodolist}>x</button>
            </h3>

            <div>
                <input className={error ? 'error' : ''} value={task} onChange={onChangeHandler} onKeyDown={onKeyPress}/>
                <button onClick={onClickHandler}>+</button>
                {error && <div className={'error-message'}>{error}</div>}
            </div>
            <ul>
                {props.tasks.map(el => {
                    const onCheckboxHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        let newValue = e.currentTarget.checked
                        props.changeTaskStatus(props.id, el.id, newValue)
                    }
                    return (
                        <li key={el.id} className={el.isDone ? 'is-done ' : ''}>
                            <button onClick={() => removeTaskHandler(el.id)}>x</button>
                            <input type="checkbox" checked={el.isDone} onChange={onCheckboxHandler}/>
                            <span>{el.title}</span>
                        </li>
                    )
                })}
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
}