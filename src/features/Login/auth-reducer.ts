import {setAppIsInitializedAC, setAppStatusAC} from '../../app/app-reducer'
import {AppThunk} from "../../app/store";
import {authAPI, AuthDataType} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export const login = createAsyncThunk(
    'auth/login',
    async (param: AuthDataType, thunkAPI) => {
      thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
      try {
        const res = await authAPI.login(param)
        if (res.data.resultCode === 0) {
          thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
          return {isLoggedIn: true}
        } else {
          handleServerAppError(res.data, thunkAPI.dispatch)
          return thunkAPI.rejectWithValue({errors: res.data.messages})
        }
      } catch (error: any) {
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({errors: error})
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
