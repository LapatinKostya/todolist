import React, {useCallback, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../app/store";
import {
    changeTodolistFilterAC,
    addTodolistTC,
    setTodolistsTC,
    FilterValuesType,
    removeTodolistTC,
    updateTodolistTitleTC
} from "./Todolist/todolists-reducer";
import {createTasksTC, removeTasksTC, updateTC} from "./Todolist/Task/tasks-reducer";
import {TaskStatuses} from "../../api/todolists-api";
import Grid from "@mui/material/Grid";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import Paper from "@mui/material/Paper";
import {Todolist} from "./Todolist/Todolist";
import {Navigate} from "react-router-dom";
import {RequestStatusType} from "../../app/app-reducer";

type TodolistsListPropsType = {
    appStatus: RequestStatusType
}

export const TodolistsList: React.FC<TodolistsListPropsType> = (props) => {

    const todolists = useAppSelector(state => state.todolists)
    const tasks = useAppSelector(state => state.tasks)
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setTodolistsTC())
    }, [dispatch])

    const removeTask = useCallback(function (todolistId: string, taskId: string) {
        dispatch(removeTasksTC(todolistId, taskId))
    }, [dispatch]);
    const addTask = useCallback(function (todolistId: string, title: string) {
        dispatch(createTasksTC(todolistId, title))
    }, [dispatch]);
    const updateTaskStatus = useCallback(function (todolistId: string, taskId: string, status: TaskStatuses) {
        dispatch(updateTC(todolistId, taskId, {status: status}))
    }, [dispatch]);
    const updateTaskTitle = useCallback(function (todolistId: string, taskId: string, newTitle: string) {
        dispatch(updateTC(todolistId, taskId, {title: newTitle}))
    }, [dispatch]);

    const updateTodolistFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        const action = changeTodolistFilterAC({id: todolistId, filter: value});
        dispatch(action);
    }, [dispatch]);
    const removeTodolist = useCallback(function (todolistId: string) {
        dispatch(removeTodolistTC(todolistId))
    }, [dispatch]);
    const updateTodolistTitle = useCallback(function (todolistId: string, title: string) {
        dispatch(updateTodolistTitleTC(todolistId, title))
    }, [dispatch]);
    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
    }, [dispatch]);

    if (!isLoggedIn) {
        return <Navigate to={'/login'}/>
    }

    return (
        <>
            <Grid container style={{padding: '20px'}}>
                <AddItemForm addItem={addTodolist} disabled={props.appStatus === 'loading'}/>
            </Grid>
            <Grid container spacing={3}>
                {
                    todolists.map(tl => {

                        let allTodolistTasks = tasks[tl.id];

                        return <Grid item key={tl.id}>
                            <Paper style={{padding: '10px'}}>
                                <Todolist
                                    id={tl.id}
                                    title={tl.title}
                                    tasks={allTodolistTasks}
                                    removeTask={removeTask}
                                    changeFilter={updateTodolistFilter}
                                    addTask={addTask}
                                    changeTaskStatus={updateTaskStatus}
                                    filter={tl.filter}
                                    removeTodolist={removeTodolist}
                                    changeTaskTitle={updateTaskTitle}
                                    changeTodolistTitle={updateTodolistTitle}
                                    entityStatus={tl.entityStatus}
                                />
                            </Paper>
                        </Grid>
                    })
                }
            </Grid>
        </>
    )
}