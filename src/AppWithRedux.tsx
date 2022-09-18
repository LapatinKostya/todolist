import React, {useCallback} from 'react';
import './App.css';
import {Todolist} from "./components/Todolist";
import {AddItemForm} from "./components/AddItemForm";
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC
} from "./state/todolists-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {TaskStateType, TodolistType} from "./App";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";

export type filterType = 'all' | 'active' | 'completed'

function AppWidthRedux() {
    console.log('App called')

    const dispatch = useDispatch()

    const todolists = useSelector<AppRootStateType, Array<TodolistType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TaskStateType>(state => state.tasks)

    const addTodoList = useCallback((title: string) => {
        dispatch(addTodolistAC(title))
    }, [dispatch])
    const removeTodolist = useCallback((todoId: string) => {
        dispatch(removeTodolistAC(todoId))
    }, [dispatch])
    const changeTodolistFilter = useCallback((value: filterType, toDoId: string) => {
        dispatch(changeTodolistFilterAC(toDoId, value))
    }, [dispatch])
    const changeTodolistTitle = useCallback((todoId: string, value: string) => {
        dispatch(changeTodolistTitleAC(todoId, value))
    }, [dispatch])

    const removeTask =useCallback((toDoId: string, id: string) => {
        dispatch(removeTaskAC(toDoId, id))
    }, [dispatch])
    const addTask = useCallback( (toDoId: string, task: string) => {
        dispatch(addTaskAC(toDoId, task))
    },[dispatch])
    const changeTaskStatus = useCallback((toDoId: string, id: string, isDone: boolean) => {
        dispatch(changeTaskStatusAC(toDoId, id, isDone))
    }, [dispatch])
    const changeTaskTitle =useCallback((todoId: string, taskId: string, value: string) => {
        dispatch(changeTaskTitleAC(todoId, taskId, value))
    }, [dispatch])

    return (
        <div className="App">
            <AddItemForm addItem={addTodoList}/>
            {todolists.map((tl) => {

                let taskForTodolist = tasks[tl.id]

                return (
                    <Todolist
                        key={tl.id}
                        id={tl.id}
                        tasks={taskForTodolist}
                        title={tl.title}
                        filter={tl.filter}
                        changeFilter={changeTodolistFilter}
                        removeTodolist={removeTodolist}
                        changeTodolistTitle={changeTodolistTitle}
                        removeTask={removeTask}
                        addTask={addTask}
                        changeTaskStatus={changeTaskStatus}
                        changeTaskTitle={changeTaskTitle}
                    />
                )
            })}
        </div>
    );
}

export default AppWidthRedux;
