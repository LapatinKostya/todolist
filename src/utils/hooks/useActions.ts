import {useAppDispatch} from "./useAppDispatch";
import {bindActionCreators} from "redux";
import {taskActions, todolistActions} from "../../features/TodolistsList";
import {useMemo} from "react";

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