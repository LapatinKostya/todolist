import {asyncActions as taskAsyncActions} from './tasks-reducer'
import {asyncActions as todolistAsyncActions, slice} from './todolists-reducer'

const todolistActions = {
  ...todolistAsyncActions,
  ...slice.actions
}
const taskActions = {
  ...taskAsyncActions
}

export {
  taskActions,
  todolistActions,
}