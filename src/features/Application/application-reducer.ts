import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit"
import {authAPI} from "../../api/todolists-api"
import {authActions} from "../Auth";
import {appActions} from "../CommonActions/App";

const initializeApp = createAsyncThunk('application/initializeApp', async (param, {dispatch}) => {
  const res = await authAPI.me()
  if (res.data.resultCode === 0) {
    dispatch(authActions.setIsLoggedIn({value: true}))
  } else {

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
    setAppError(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error;
    },
    setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status;
    },
    setInitialiseApp(state, action: PayloadAction<{ isInitialised: boolean }>) {
      state.isInitialized = action.payload.isInitialised
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(initializeApp.fulfilled, (state) => {
          state.isInitialized = true
        })
        .addCase(appActions.setAppStatus, (state, action) => {
          state.status = action.payload.status
        })
        .addCase(appActions.setAppError, (state, action) => {
          state.error = action.payload.error
        })
  }
})

export const asyncActions = {
  initialiseApp: initializeApp
}
export const {setInitialiseApp} = slice.actions

// types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

