import {ResponseType} from "../api/types";
import {appActions} from "../features/CommonActions/App";


// export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
//   dispatch(appActions.setAppErrorAC({error: data.messages.length ? data.messages[0] : 'Some error occurred'}))
//   dispatch(appActions.setAppStatusAC({status: 'failed'}))
// }
//
// export const handleServerNetworkError = (error: { message: string }, dispatch: ErrorUtilsDispatchType) => {
//   dispatch(appActions.setAppErrorAC({error: error.message ? error.message : 'Some error occurred'}))
//   dispatch(appActions.setAppStatusAC({status: 'failed'}))
// }
export const handleAsyncServerAppError = <D>(data: ResponseType<D>,
                                             thunkAPI: ThunkAPIType,) => {

  thunkAPI.dispatch(appActions.setAppError({error: data.messages.length ? data.messages[0] : 'Some error occurred'}))
  thunkAPI.dispatch(appActions.setAppStatus({status: 'failed'}))
  return thunkAPI.rejectWithValue({errors: data.messages, fieldsErrors: data.fieldsErrors})
}

export const handleAsyncServerNetworkError = (error: { message: string },
                                              thunkAPI: ThunkAPIType) => {
  thunkAPI.dispatch(appActions.setAppError({error: error.message ? error.message : 'Some error occurred'}))
  thunkAPI.dispatch(appActions.setAppStatus({status: 'failed'}))

  return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
}

type ThunkAPIType = {
  dispatch: (action: any) => any
  rejectWithValue: Function
}

// type ErrorUtilsDispatchType = Dispatch<SetAppErrorAT | SetAppStatusAT>

// export type SetAppErrorAT = ReturnType<typeof setAppErrorAC>
// export type SetAppStatusAT = ReturnType<typeof setAppStatusAC>