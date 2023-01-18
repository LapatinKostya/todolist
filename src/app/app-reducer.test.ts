import {appReducer, RequestStatusType, setAppErrorAC, setAppStatusAC} from './app-reducer'

type startStateType = {
    status: RequestStatusType
    error :string| null
    isInitialized: boolean
}

let startState: startStateType

beforeEach(()=> {
    startState = {
        status: 'idle',
        error: null,
        isInitialized: false
    }
});
test('Correct error message should be set',()=> {
    const endState = appReducer(startState, setAppErrorAC({error :'some error'}))
    expect(endState.error).toBe('some error')
})
test('Correct status should be set',()=> {
    const endState = appReducer(startState, setAppStatusAC({status:'succeeded'}))
    expect(endState.status).toBe('succeeded')
})