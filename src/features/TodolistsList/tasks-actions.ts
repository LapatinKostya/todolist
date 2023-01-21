import {createAsyncThunk} from "@reduxjs/toolkit";
import {setAppStatusAC} from "../../app/app-reducer";
import {todolistsAPI, UpdateTaskModelType} from "../../api/todolists-api";
import {RootState} from "../../app/store";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {changeTaskEntityStatusAC, UpdateDomainTaskModelType} from "./tasks-reducer";
import {AxiosError} from "axios";

export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (todolistId: string, thunkAPI) => {
      thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
      const res = await todolistsAPI.getTasks(todolistId)
      thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
      return {todolistId, tasks: res.data.items}
    })
export const removeTask = createAsyncThunk(
    'tasks/removeTask',
    async (param: { todolistId: string, taskId: string }, thunkAPI) => {
      thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
      thunkAPI.dispatch(changeTaskEntityStatusAC({
        todolistId: param.todolistId,
        taskId: param.taskId,
        entityStatus: 'loading'
      }))
      const res = todolistsAPI.deleteTask(param.todolistId, param.taskId)

      thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
      thunkAPI.dispatch(changeTaskEntityStatusAC({
        todolistId: param.todolistId,
        taskId: param.taskId,
        entityStatus: 'succeeded'
      }))
      return {taskId: param.taskId, todolistId: param.todolistId}
    })
export const addTask = createAsyncThunk(
    'tasks/addTask',
    async (param: { todolistId: string, title: string }, thunkAPI) => {
      thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
      try {
        const res = await todolistsAPI.createTask(param.todolistId, param.title)
        if (res.data.resultCode === 0) {
          thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
          return res.data.data.item
        } else {
          handleServerAppError(res.data, thunkAPI.dispatch)
          return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
      } catch (e) {
        const err = e as Error | AxiosError<{ error: string }>
        handleServerNetworkError(err, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({errors: [err.message], fieldsErrors: undefined})
      }
    }
)
export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async (param: { todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType }, thunkAPI) => {
      thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
      thunkAPI.dispatch(changeTaskEntityStatusAC({
        todolistId: param.todolistId,
        taskId: param.taskId,
        entityStatus: 'loading'
      }))
      const state = thunkAPI.getState() as RootState
      const task = state.tasks[param.todolistId].find(t => t.id === param.taskId)
      if (!task) {
        return thunkAPI.rejectWithValue('Task not found in state')
      }
      const model: UpdateTaskModelType = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        ...param.domainModel
      }
      try {
        const res = await todolistsAPI.updateTask(param.todolistId, param.taskId, model)
        if (res.data.resultCode === 0) {
          thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
          thunkAPI.dispatch(changeTaskEntityStatusAC({
            todolistId: param.todolistId,
            taskId: param.taskId,
            entityStatus: 'succeeded'
          }))
          return res.data.data.item
        } else {
          handleServerAppError(res.data, thunkAPI.dispatch)
          return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
      } catch (e) {
        const err = e as Error | AxiosError<{ error: string }>
        handleServerNetworkError(err, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(null)
      }
    }
)