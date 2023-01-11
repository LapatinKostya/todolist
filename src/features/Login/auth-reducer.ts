import {SetAppErrorAT, setAppIsInitializedAC, setAppStatusAC, SetAppStatusAT} from '../../app/app-reducer'
import {AppThunk} from "../../app/store";
import {authAPI, AuthDataType} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
}
// type InitialStateType = typeof initialState

const slice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{value: boolean}>) {
      state.isLoggedIn = action.payload.value;
    }
  }
})

export const authReducer = slice.reducer

const {setIsLoggedInAC} = slice.actions

// thunks
export const loginTC = (data: AuthDataType): AppThunk => dispatch => {
  dispatch(setAppStatusAC('loading'))
  authAPI.login(data)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(setIsLoggedInAC({value: true}))
          dispatch(setAppStatusAC('succeeded'))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
}
export const logOutTC = (): AppThunk => dispatch => {
  dispatch(setAppStatusAC('loading'))
  authAPI.logOut()
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(setIsLoggedInAC({value: false}))
          dispatch(setAppStatusAC('succeeded'))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
}
export const meTC = (): AppThunk => dispatch => {
  dispatch(setAppStatusAC('loading'))
  authAPI.me()
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(setIsLoggedInAC({value: true}))
          dispatch(setAppStatusAC('succeeded'))

        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
      .finally(() => {
            dispatch(setAppIsInitializedAC(true))
          }
      )
}

// types
export type AuthReducerAT = ReturnType<typeof setIsLoggedInAC> | SetAppErrorAT | SetAppStatusAT
