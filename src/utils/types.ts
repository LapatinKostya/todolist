import {rootReducer, store} from "../app/store";
import {FieldErrorType} from "../api/types";

export type AppDispatch = typeof store.dispatch
export type RootReducer = typeof rootReducer
export type RootState = ReturnType<typeof store.getState>
export type ThunkError = { rejectValue: { errors: string[], fieldsErrors?: FieldErrorType[] } }