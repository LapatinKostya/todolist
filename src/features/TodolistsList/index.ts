import * as taskActions from './tasks-actions'
import * as todolistAsyncActions from './todolists-actions'
import {slice} from './todolists-reducer'

const  todolistActions = {
  ...todolistAsyncActions,
  ...slice.actions
}

export {
  taskActions,
  todolistActions,
}