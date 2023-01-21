import {useAppDispatch} from "./useAppDispatch";
import {bindActionCreators} from "redux";
import {useMemo} from "react";
import {taskActions, todolistActions} from "../../features/TodolistsList";

const allActions = {
  ...taskActions,
  ...todolistActions
}

export const useActions = () => {
  const dispatch = useAppDispatch()

  return useMemo(() => {
    return bindActionCreators(allActions, dispatch)
  }, [dispatch])
}