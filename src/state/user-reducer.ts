type StateType = {
    age: number
    childrenCount: number
    name: string
}
type ActionType = {
    type: string
    [key: string]: any
}

export const userReducer = (state: StateType, action: ActionType) => {
    switch (action.type){
        case 'INCREMENT-AGE':
            let newState = {...state}
            newState.age = newState.age + 1
            return newState
        case 'INCREMENT-CHILD-COUNT':
            return {
                ...state, childrenCount: state.childrenCount + 1
            }
        case 'CHANGE-NAME':
            return {
                ...state, name: action.newName
            }
        default:
            throw new Error('i don\'t understand')
    }
}