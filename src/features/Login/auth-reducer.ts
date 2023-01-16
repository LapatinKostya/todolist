import {setAppIsInitializedAC, setAppStatusAC} from '../../app/app-reducer'
import {AppThunk} from "../../app/store";
import {authAPI, AuthDataType, FieldErrorType} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

export const login = createAsyncThunk<{isLoggedIn: boolean}, AuthDataType, {
  rejectValue: {errors: string[], fieldsErrors?: FieldErrorType[]}
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

const slice = createSlice({
      name: 'auth',
      initialState: {
        isLoggedIn: false,
      },
      reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
          state.isLoggedIn = action.payload.value;
        }
      },
      extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
              state.isLoggedIn = action.payload.isLoggedIn
            })
      }
    }
)

export const authReducer = slice.reducer

const {setIsLoggedInAC} = slice.actions

// thunks

export const logOutTC = (): AppThunk => dispatch => {
  dispatch(setAppStatusAC({status: 'loading'}))
  authAPI.logOut()
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(setIsLoggedInAC({value: false}))
          dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
}
export const meTC = (): AppThunk => dispatch => {
  dispatch(setAppStatusAC({status: 'loading'}))
  authAPI.me()
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(setIsLoggedInAC({value: true}))
          dispatch(setAppStatusAC({status: 'succeeded'}))

        } else {
          handleServerAppError(res.data, dispatch)
          dispatch(setAppStatusAC({status: 'failed'}))
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
      .finally(() => {
            dispatch(setAppIsInitializedAC({isInitialized: true}))
          }
      )
}
