import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {filterType} from "../App";

type TodolistPropsType = {
    title: string
    tasks: Array<TasksType>
    removeTask: (id: string) => void
    changeFilter: (type: filterType) => void
    addTask: (task: string) => void
}

type TasksType = {
    id: string
    title: string
    isDone: boolean
}

export const Todolist = (props: TodolistPropsType) => {

    const [task, setTask] = useState<string>('')

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTask(e.currentTarget.value)
    }
    const onClickHandler = () => {
        props.addTask(task)
        setTask('')
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
    const onEnter = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onClickHandler()
        }
    }

    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input value={task} onChange={onChangeHandler} onKeyDown={onEnter}/>
                <button onClick={onClickHandler}>+</button>
            </div>
            <ul>
                {props.tasks.map(el => {
                    return (
                        <li key={el.id}>
                            <button onClick={() => removeTaskHandler(el.id)}>x</button>
                            <input type="checkbox" checked={el.isDone}/>
                            <span>{el.title}</span>
                        </li>
                    )
                })}
            </ul>
            <div>
                <button onClick={onClickAll}>All</button>
                <button onClick={onClickActive}>Active</button>
                <button onClick={onClickCompleted}>Completed</button>
            </div>
        </div>
    )
}