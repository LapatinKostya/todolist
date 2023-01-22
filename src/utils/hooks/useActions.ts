import {useAppDispatch} from "./useAppDispatch";
import {bindActionCreators} from "redux";
import {useMemo} from "react";
import {taskActions, todolistActions} from "../../features/TodolistsList";
import {appActions} from "../../app";
import {authActions} from "../../features/Auth";

const allActions = {
  ...taskActions,
  ...todolistActions,
  ...appActions,
  ...authActions
}

export const useActions = () => {
  const dispatch = useAppDispatch()

  return useMemo(() => {
    return bindActionCreators(allActions, dispatch)
  }, [dispatch])
}