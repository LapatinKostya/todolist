import * as appSelectors from './selectors'
import {asyncActions, slice} from './app-reducer'

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