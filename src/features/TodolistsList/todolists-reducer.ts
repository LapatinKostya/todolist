import {todolistsAPI} from "../../api/todolists-api";
import {RequestStatusType} from "../Application/application-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleAsyncServerAppError, handleAsyncServerNetworkError} from "../../utils/error-utils";
import {AxiosError} from "axios";
import {ThunkError} from "../../utils/types";
import {TodolistType} from "../../api/types";
import {appActions} from "../CommonActions/App";

const {setAppStatus} = appActions

const fetchTodolists = createAsyncThunk<{ todolists: TodolistType[] }, undefined, ThunkError>(
    'todolist/fetchTodolists',
    async (ThunkArg, thunkAPI) => {
      thunkAPI.dispatch(setAppStatus({status: 'loading'}))
      try {
        const res = await todolistsAPI.getTodolists()
        return {todolists: res.data}
      } catch (e) {
        const err = e as Error | AxiosError<{ error: string }>
        return handleAsyncServerNetworkError(err, thunkAPI)
      }
    }
)
const removeTodolist = createAsyncThunk<{ todolistId: string }, { todolistId: string }, ThunkError>(
    'todolist/removeTodolist',
    async (ThunkArg, thunkAPI) => {
      thunkAPI.dispatch(setAppStatus({status: 'loading'}))
      try {
        const res = await todolistsAPI.deleteTodolist(ThunkArg.todolistId)
        if (res.data.resultCode === 0) {
          thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
          return {todolistId: ThunkArg.todolistId}
        } else {
          return handleAsyncServerAppError(res.data, thunkAPI)
        }
      } catch (e) {
        const err = e as Error | AxiosError<{ error: string }>
        return handleAsyncServerNetworkError(err, thunkAPI)
      }
    }
)

const addTodolist = createAsyncThunk<
    { todolist: TodolistType },
    { title: string },
    ThunkError>(
    'todolist/addTodolist',
    async (ThunkArg, thunkAPI) => {
      thunkAPI.dispatch(setAppStatus({status: 'loading'}))
      try {
        const res = await todolistsAPI.createTodolist(ThunkArg.title)
        if (res.data.resultCode === 0) {
          thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
          return {todolist: res.data.data.item}
        } else {
          return handleAsyncServerAppError(res.data, thunkAPI)
        }
      } catch (e) {
        const err = e as Error | AxiosError<{ error: string }>
        return handleAsyncServerNetworkError(err, thunkAPI)
      }
    }
)

export const changeTodolistTitle = createAsyncThunk<
    { todolistId: string, title: string },
    { todolistId: string, title: string },
    ThunkError>(
    'todolist/updateTodolistTitle',
    async (ThunkArg, thunkAPI) => {
      thunkAPI.dispatch(setAppStatus({status: 'loading'}))
      try {
        const res = await todolistsAPI.updateTodolistTitle(ThunkArg.todolistId, ThunkArg.title)
        if (res.data.resultCode === 0) {
          thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
          return {todolistId: ThunkArg.todolistId, title: ThunkArg.title}
        } else {
          return handleAsyncServerAppError(res.data, thunkAPI)
        }
      } catch (e) {
        const err = e as Error | AxiosError<{ error: string }>
        return handleAsyncServerNetworkError(err, thunkAPI)
      }
    }
)

export const asyncActions = {
  fetchTodolists,
  removeTodolist,
  addTodolist,
  changeTodolistTitle
}

export const slice = createSlice({
  name: 'todolist',
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeTodolistFilter(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state[index].filter = action.payload.filter
    },
    changeTodolistEntityStatus(state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state[index].entityStatus = action.payload.entityStatus
    },
  },
  extraReducers: builder => {
    builder
        .addCase(fetchTodolists.fulfilled, (state, action) => {
          return action.payload.todolists.map(t => ({...t, filter: 'all', entityStatus: 'idle'}))
        })
        .addCase(removeTodolist.fulfilled, (state, action) => {
          const index = state.findIndex(tl => tl.id === action.payload.todolistId)
          state.splice(index, 1)
        })
        .addCase(addTodolist.fulfilled, (state, action) => {
          state.unshift({...action.payload.todolist, filter: "all", entityStatus: 'idle'})
        })
        .addCase(changeTodolistTitle.fulfilled, (state, action) => {
          const index = state.findIndex(tl => tl.id === action.payload.todolistId)
          state[index].title = action.payload.title
        })
  },
})

// for tests
export const {
  changeTodolistFilter,
  changeTodolistEntityStatus
} = slice.actions

// types
export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
