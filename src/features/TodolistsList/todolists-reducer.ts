import {todolistsAPI, TodolistType} from "../../api/todolists-api";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {AxiosError} from "axios";

const fetchTodolists = createAsyncThunk(
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
const removeTodolist = createAsyncThunk(
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
const addTodolist = createAsyncThunk(
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
export const changeTodolistTitle = createAsyncThunk(
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

export const todolistsReducer = slice.reducer

// for tests
export const {
  changeTodolistFilter,
  changeTodolistEntityStatus
} = slice.actions

// types
export type FilterValuesType = 'all' | 'active' | 'completed';

export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType

}