import React from 'react';
import './App.css';
import {Todolist} from "./components/Todolist";
import {AddItemForm} from "./components/AddItemForm";
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {TaskStateType, TodolistType} from "./App";

export type filterType = 'all' | 'active' | 'completed'

function AppWidthRedux() {

    const dispatch = useDispatch()

    const todolists = useSelector<AppRootStateType, Array<TodolistType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TaskStateType>(state => state.tasks)


    const addTodoList = (title: string) => {
        dispatch(addTodolistAC(title))
    }
    const removeTodolist = (todoId: string) => {
        dispatch(removeTodolistAC(todoId))
    }
    const changeTodolistFilter = (value: filterType, toDoId: string) => {
        dispatch(changeTodolistFilterAC(toDoId, value))
    }
    const changeTodolistTitle = (todoId: string, value: string) => {
        dispatch(changeTodolistTitleAC(todoId, value))
    }

    const removeTask = (toDoId: string, id: string) => {
        dispatch(removeTaskAC(toDoId, id))
    }
    const addTask = (toDoId: string, task: string) => {
        dispatch(addTaskAC(toDoId, task))
    }
    const changeTaskStatus = (toDoId: string, id: string, isDone: boolean) => {
        dispatch(changeTaskStatusAC(toDoId, id, isDone))
    }
    const changeTaskTitle = (todoId: string, taskId: string, value: string) => {
        dispatch(changeTaskTitleAC(todoId, taskId, value))
    }

    return (
        <div className="App">
            <AddItemForm addItem={addTodoList}/>
            {todolists.map((tl) => {

                let tasksForTodolist = tasks[tl.id]

                if (tl.filter === 'active') {
                    tasksForTodolist = tasksForTodolist.filter(el => !el.isDone)
                }
                if (tl.filter === 'completed') {
                    tasksForTodolist = tasksForTodolist.filter(el => el.isDone)
                }
                return (
                    <Todolist
                        key={tl.id}
                        id={tl.id}
                        title={tl.title}
                        filter={tl.filter}
                        tasks={tasksForTodolist}
                        removeTask={removeTask}
                        changeFilter={changeTodolistFilter}
                        addTask={addTask}
                        changeTaskStatus={changeTaskStatus}
                        removeTodolist={removeTodolist}
                        changeTaskTitle={changeTaskTitle}
                        changeTodolistTitle={changeTodolistTitle}
                    />
                )
            })}
        </div>
    );
}

export default AppWidthRedux;
