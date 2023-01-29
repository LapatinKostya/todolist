import {RequestStatusType} from './application-reducer'
import {appReducer} from "./index";
import {appActions} from "../CommonActions/App";

type startStateType = {
  status: RequestStatusType
  error: string | null
  isInitialized: boolean
}

let startState: startStateType

beforeEach(() => {
  startState = {
    status: 'idle',
    error: null,
    isInitialized: false
  }
});
test('Correct error message should be set', () => {
  const endState = appReducer(startState, appActions.setAppError({error: 'some error'}))
  expect(endState.error).toBe('some error')
})
test('Correct status should be set', () => {
  const endState = appReducer(startState, appActions.setAppStatus({status: 'succeeded'}))
  expect(endState.status).toBe('succeeded')
})