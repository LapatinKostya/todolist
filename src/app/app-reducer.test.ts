import {appReducer, InitialStateType, setAppErrorAC, setAppStatusAC} from './app-reducer'

let startState: InitialStateType  =

beforeEach(()=> {
    startState = {
        status: 'idle',
        error: null,
        isInitialized: false

    }
});
test('Correct error message should be set',()=> {
    const endState = appReducer(startState, setAppErrorAC('some error'))
    expect(endState.error).toBe('some error')
})
test('Correct status should be set',()=> {
    const endState = appReducer(startState, setAppStatusAC('succeeded'))
    expect(endState.status).toBe('succeeded')
})