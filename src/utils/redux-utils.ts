import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {ActionCreatorsMapObject, bindActionCreators} from "redux";
import {useMemo} from "react";
import {AppDispatch, RootState} from "./types";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector


export const useAppDispatch: () => AppDispatch = useDispatch

export function useActions<T extends ActionCreatorsMapObject<any>>(action: T) {
  const dispatch = useAppDispatch()

  return useMemo(() => {
    return bindActionCreators(action, dispatch)
  }, [dispatch])
}