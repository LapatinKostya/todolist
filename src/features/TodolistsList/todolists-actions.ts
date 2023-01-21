import {createAsyncThunk} from "@reduxjs/toolkit";
import {setAppStatusAC} from "../../app/app-reducer";
import {todolistsAPI} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {AxiosError} from "axios";

export const fetchTodolists = createAsyncThunk(
    'todolist/fetchTodolists',
    async (arg, thunkAPI) => {
      thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
      try {
        const res = await todolistsAPI.getTodolists()
        return {todolists: res.data}
      } catch (e) {
        thunkAPI.dispatch(setAppStatusAC({status: "failed"}))
        return thunkAPI.rejectWithValue(null)
      }
    }
)
export const removeTodolist = createAsyncThunk(
    'todolist/removeTodolist',
    async (param: { todolistId: string }, thunkAPI) => {
      thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
      try {
        const res = await todolistsAPI.deleteTodolist(param.todolistId)
        if (res.data.resultCode === 0) {
          thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
          return {todolistId: param.todolistId}
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
export const addTodolist = createAsyncThunk(
    'todolist/addTodolist',
    async (param: { title: string }, thunkAPI) => {
      thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
      try {
        const res = await todolistsAPI.createTodolist(param.title)
        if (res.data.resultCode === 0) {
          thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
          return {todolist: res.data.data.item}
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
export const updateTodolistTitle = createAsyncThunk(
    'todolist/updateTodolistTitle',
    async (param: { todolistId: string, title: string }, thunkAPI) => {
      thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
      try {
        const res = await todolistsAPI.updateTodolistTitle(param.todolistId, param.title)
        if (res.data.resultCode === 0) {
          thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
          return {todolistId: param.todolistId, title: param.title}
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