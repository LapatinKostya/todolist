import React, {useCallback, useEffect} from "react";

import {FilterValuesType,} from "./todolists-reducer";
import {TaskStatuses} from "../../api/todolists-api";
import Grid from "@mui/material/Grid";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import Paper from "@mui/material/Paper";
import {Todolist} from "./Todolist/Todolist";
import {Navigate} from "react-router-dom";
import {RequestStatusType} from "../../app/app-reducer";
import {useAppSelector} from "../../utils/hooks/useAppSelector";
import {authSelectors} from "../Auth";
import {useActions} from "../../utils/hooks/useActions";


type TodolistsListPropsType = {
  appStatus: RequestStatusType
  demo?: boolean
}

export const TodolistsList = ({appStatus, demo}: TodolistsListPropsType) => {
  const {
    addTask,
    updateTask,
    removeTask,
    addTodolist,
    removeTodolist,
    fetchTodolists,
    updateTodolistTitle,
    changeTodolistFilter
  } = useActions()

  const todolists = useAppSelector(state => state.todolists)
  const tasks = useAppSelector(state => state.tasks)
  const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn)

  useEffect(() => {
    fetchTodolists()
  }, [])

  const removeTaskCallback = useCallback(function (todolistId: string, taskId: string) {
    removeTask({todolistId, taskId})
  }, []);
  const addTaskHandler = useCallback(function (todolistId: string, title: string) {
    addTask({todolistId, title})
  }, []);
  const updateTaskStatus = useCallback(function (todolistId: string, taskId: string, status: TaskStatuses) {
    updateTask({taskId, todolistId, domainModel: {status}})
  }, []);
  const updateTaskTitle = useCallback(function (todolistId: string, taskId: string, newTitle: string) {
    updateTask({todolistId, taskId, domainModel: {title: newTitle}})
  }, []);

  const updateTodolistFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
    changeTodolistFilter({id: todolistId, filter: value})
  }, []);
  const removeTodolistHandler = useCallback(function (todolistId: string) {
    removeTodolist({todolistId})
  }, []);
  const updateTodolistTitleHandler = useCallback(function (todolistId: string, title: string) {
    updateTodolistTitle({todolistId, title})
  }, []);
  const addTodolistHandler = useCallback((title: string) => {
    addTodolist({title})
  }, []);

  if (!isLoggedIn) {
    return <Navigate to={'/login'}/>
  }

  return (
      <>
        <Grid container style={{padding: '20px'}}>
          <AddItemForm addItem={addTodolistHandler} disabled={appStatus === 'loading'}/>
        </Grid>
        <Grid container spacing={3}>
          {
            todolists.map(tl => {
              const allTodolistTasks = tasks[tl.id];
              return (
                  <Grid item key={tl.id}>
                    <Paper style={{padding: '10px'}}>
                      <Todolist
                          id={tl.id}
                          title={tl.title}
                          tasks={allTodolistTasks}
                          removeTask={removeTaskCallback}
                          changeFilter={updateTodolistFilter}
                          addTask={addTaskHandler}
                          changeTaskStatus={updateTaskStatus}
                          filter={tl.filter}
                          removeTodolist={removeTodolistHandler}
                          changeTaskTitle={updateTaskTitle}
                          changeTodolistTitle={updateTodolistTitleHandler}
                          entityStatus={tl.entityStatus}
                          demo={demo}
                      />
                    </Paper>
                  </Grid>
              )
            })}
        </Grid>
      </>
  )
}