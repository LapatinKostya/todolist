import {useAppDispatch} from "./useAppDispatch";
import {ActionCreatorsMapObject, bindActionCreators} from "redux";
import {useMemo} from "react";

export function useActions<T extends ActionCreatorsMapObject<any>>(action: T) {
  const dispatch = useAppDispatch()

  return useMemo(() => {
    return bindActionCreators(action, dispatch)
  }, [dispatch])
}
