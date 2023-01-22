import {Login} from './Login'
import * as authSelectors from './selectors'
import {asyncActions as asyncAuthActions} from './auth-reducer'

const authActions = {
  ...asyncAuthActions
}

export {
  authSelectors,
  authActions,
  Login
}