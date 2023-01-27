import {setAppErrorAC, setAppStatusAC,} from '../app/app-reducer'
import {Dispatch} from 'redux'
import {ResponseType} from "../api/todolists-api"

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
  dispatch(setAppErrorAC({error: data.messages.length ? data.messages[0] : 'Some error occurred'}))
  dispatch(setAppStatusAC({status: 'failed'}))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: ErrorUtilsDispatchType) => {
  dispatch(setAppErrorAC({error: error.message ? error.message: 'Some error occurred'}))
  dispatch(setAppStatusAC({status: 'failed'}))
}

type ErrorUtilsDispatchType = Dispatch<SetAppErrorAT | SetAppStatusAT>

export type SetAppErrorAT = ReturnType<typeof setAppErrorAC>
export type SetAppStatusAT = ReturnType<typeof setAppStatusAC>