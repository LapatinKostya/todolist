import {authAPI} from "../../api/todolists-api"
import {handleAsyncServerAppError, handleAsyncServerNetworkError} from "../../utils/error-utils"
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit"
import {AxiosError} from "axios"
import {AuthDataType} from "../../api/types";
import {ThunkError} from "../../utils/types";
import {appActions} from "../CommonActions/App";

const {setAppStatus} = appActions

export const login = createAsyncThunk<{ isLoggedIn: boolean }, AuthDataType, ThunkError>(
    'auth/login',
    async (param, thunkAPI) => {
      thunkAPI.dispatch(setAppStatus({status: 'loading'}))
      try {
        const res = await authAPI.login(param)
        if (res.data.resultCode === 0) {
          thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
          return {isLoggedIn: true}
        } else {
          return  handleAsyncServerAppError(res.data, thunkAPI)
        }
      } catch (e) {
        const err = e as Error | AxiosError<{ error: string }>
        return handleAsyncServerNetworkError(err, thunkAPI)
      }
    })

const logOut = createAsyncThunk('auth/logOut',
    async (param, thunkAPI) => {
      thunkAPI.dispatch(setAppStatus({status: 'loading'}))
      try {
        const res = await authAPI.logOut()
        if (res.data.resultCode === 0) {
          thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
          return
        } else {
          return  handleAsyncServerAppError(res.data, thunkAPI)
        }
      } catch (e) {
        const err = e as Error | AxiosError<{ error: string }>
        return handleAsyncServerNetworkError(err, thunkAPI)
      }
    })

export const asyncActions = {
  login,
  logOut
}

export const slice = createSlice({
      name: 'auth',
      initialState: {
        isLoggedIn: false,
      },
      reducers: {
        setIsLoggedIn(state, action: PayloadAction<{ value: boolean }>) {
          state.isLoggedIn = action.payload.value
        }
      },
      extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state) => {
              state.isLoggedIn = true
            })
            .addCase(logOut.fulfilled, (state) => {
              state.isLoggedIn = false
            })
      }
    }
)

