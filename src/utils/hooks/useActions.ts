import {useAppDispatch} from "./useAppDispatch";
import {bindActionCreators} from "redux";
import {taskActions, todolistActions} from "../../features/TodolistsList";

const allActions = {
  ...taskActions,
  ...todolistActions
}

export const useActions = () => {
  const dispatch = useAppDispatch()
  return bindActionCreators(allActions, dispatch)
}