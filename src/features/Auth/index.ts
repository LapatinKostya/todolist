import {Login} from './Login'
import * as authSelectors from './selectors'
import {asyncActions, slice} from './auth-reducer'

const authActions = {
  ...asyncActions
}
const authReducer = slice.reducer

export {
  authSelectors,
  authActions,
  authReducer,
  Login,
}