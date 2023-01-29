import * as appSelectors from './selectors'
import {asyncActions, slice} from './application-reducer'

const appActions = {
  ...asyncActions,
  ...slice.actions,
}

const appReducer = slice.reducer

export {
  appActions,
  appSelectors,
  appReducer
}