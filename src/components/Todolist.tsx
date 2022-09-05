import React, {ChangeEvent} from "react";
import {filterType} from "../App";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";

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
    changeTaskTitle: (todoId: string, taskId: string, value: string) => void
    changeTodolistTitle: (todoId: string, value: string) => void
}

export type TasksType = {
    id: string
    title: string
    isDone: boolean
}

export const Todolist = (props: TodolistPropsType) => {

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
    const removeTodolist = () => {
        props.removeTodolist(props.id)
    }

    const addTaskHandler = (title: string) => {
        props.addTask(props.id, title)
    }
    const onChangeTodolistTitle = (title: string) => {
        props.changeTodolistTitle(props.id, title)
    }

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
                {props.tasks.map(el => {
                    const onCheckboxHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        let newValue = e.currentTarget.checked
                        props.changeTaskStatus(props.id, el.id, newValue)
                    }
                    const onChangeStatus = (value: string) => {
                        props.changeTaskTitle(props.id, el.id, value)
                    }

                    return (
                        <li key={el.id} className={el.isDone ? 'is-done ' : ''}>
                            <button onClick={() => removeTaskHandler(el.id)}>x</button>
                            <input type="checkbox" checked={el.isDone} onChange={onCheckboxHandler}/>
                            <EditableSpan title={el.title} onChange={onChangeStatus}/>
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

