import {setAppErrorAC, setAppStatusAC,} from '../features/Application/application-reducer'
import {Dispatch} from 'redux'
import {ResponseType} from "../api/types";

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
  dispatch(setAppErrorAC({error: data.messages.length ? data.messages[0] : 'Some error occurred'}))
  dispatch(setAppStatusAC({status: 'failed'}))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: ErrorUtilsDispatchType) => {
  dispatch(setAppErrorAC({error: error.message ? error.message : 'Some error occurred'}))
  dispatch(setAppStatusAC({status: 'failed'}))
}

export const handleAsyncServerNetworkError = (error: { message: string },
                                              thunkAPI: ThunkAPIType) => {
  thunkAPI.dispatch(setAppErrorAC({error: error.message ? error.message : 'Some error occurred'}))
  thunkAPI.dispatch(setAppStatusAC({status: 'failed'}))

  return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
}

type ThunkAPIType = {
  dispatch: (action: any) => any
  rejectWithValue: Function
}

type ErrorUtilsDispatchType = Dispatch<SetAppErrorAT | SetAppStatusAT>

export type SetAppErrorAT = ReturnType<typeof setAppErrorAC>
export type SetAppStatusAT = ReturnType<typeof setAppStatusAC>