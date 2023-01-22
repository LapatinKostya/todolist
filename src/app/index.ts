import * as appSelectors from './selectors'
import {asyncActions as appAsyncActions} from './app-reducer'

const appActions = {
  ...appAsyncActions
}

export {
  appActions,
  appSelectors
}