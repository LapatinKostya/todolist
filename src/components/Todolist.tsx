import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {filterType} from "../App";

type TodolistPropsType = {
    title: string
    tasks: Array<TasksType>
    removeTask: (id: string) => void
    changeFilter: (type: filterType) => void
    addTask: (task: string) => void
    changeTaskStatus: (id: string, isDone: boolean) => void
    filter: filterType
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
        if (task.trim()) {
            props.addTask(task)
            setTask('')
            setError('')
        } else {
            setError('Should be required')
        }
    }
    const onClickAll = () => {
        props.changeFilter('all')
    }
    const onClickActive = () => {
        props.changeFilter('active')
    }
    const onClickCompleted = () => {
        props.changeFilter('completed')
    }
    const removeTaskHandler = (id: string) => {
        props.removeTask(id)
    }
    const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onClickHandler()
        }
    }
    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input className={error ? 'error' : ''} value={task} onChange={onChangeHandler} onKeyDown={onKeyPress}/>
                <button onClick={onClickHandler}>+</button>
                {error && <div className={'error-message'}>{error}</div>}
            </div>
            <ul>
                {props.tasks.map(el => {
                    const onCheckboxHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        let newValue = e.currentTarget.checked
                        props.changeTaskStatus(el.id, newValue)
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
                <button className={props.filter === 'all' ? 'active-filter' : ''} onClick={onClickAll}>All</button>
                <button className={props.filter === 'active' ? 'active-filter' : ''} onClick={onClickActive}>Active
                </button>
                <button className={props.filter === 'completed' ? 'active-filter' : ''}
                        onClick={onClickCompleted}>Completed
                </button>
            </div>
        </div>
    )
}