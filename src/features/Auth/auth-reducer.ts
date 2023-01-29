import {initialiseApp, setAppStatusAC} from '../Application/app-reducer'
import {authAPI, AuthDataType, FieldErrorType} from "../../api/todolists-api"
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils"
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import {AxiosError} from "axios"

export const login = createAsyncThunk<{ isLoggedIn: boolean }, AuthDataType, {
  rejectValue: { errors: string[], fieldsErrors?: FieldErrorType[] }
}>(
    'auth/login',
    async (param, thunkAPI) => {
      thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
      try {
        const res = await authAPI.login(param)
        if (res.data.resultCode === 0) {
          thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
          return {isLoggedIn: true}
        } else {
          handleServerAppError(res.data, thunkAPI.dispatch)
          return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
      } catch (e) {
        const err = e as Error | AxiosError<{ error: string }>
        handleServerNetworkError(err, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({errors: [err.message], fieldsErrors: undefined})
      }
    })
const logOut = createAsyncThunk('auth/logOut',
    async (param, thunkAPI) => {
      thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
      try {
        const res = await authAPI.logOut()
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
      reducers: {},
      extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state) => {
              state.isLoggedIn = true
            })
            .addCase(logOut.fulfilled, (state) => {
              state.isLoggedIn = false
            })
            .addCase(initialiseApp.fulfilled, (state) => {
              state.isLoggedIn = true
            })
      }
    }
)

