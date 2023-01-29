import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authAPI} from "../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {AxiosError} from "axios";

export const initialiseApp = createAsyncThunk('app/initialise',
    async (param, thunkAPI) => {
      thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
      try {
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
          thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
          return
        } else {
          handleServerAppError(res.data, thunkAPI.dispatch)
          return thunkAPI.rejectWithValue({})
        }
      } catch (e) {
        const err = e as Error | AxiosError<{ error: string }>
        handleServerNetworkError(err, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({})
      } finally {
        thunkAPI.dispatch(setInitialiseApp({isInitialised: true}))
      }
    })

export const slice = createSlice({
  name: 'app',
  initialState: {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false,
  },
  reducers: {
    setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error;
    },
    setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status;
    },
    setInitialiseApp(state, action: PayloadAction<{ isInitialised: boolean }>) {
      state.isInitialized = action.payload.isInitialised
    },
  },
  extraReducers: (builder) => {
    // builder
    //     .addCase(initialiseApp.fulfilled, (state) => {
    //       state.isInitialized = true
    //     })
  }
})

export const asyncActions = {
  initialiseApp
}
export const {setAppErrorAC, setAppStatusAC, setInitialiseApp} = slice.actions

// types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

