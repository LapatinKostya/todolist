import {v1} from "uuid";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./tasks-reducer";

// let todolistId1 = v1()
// let todolistId2 = v1()
//
// let startState = {
//     [todolistId1]: [
//         {id: '1', title: 'HTML&CSS', isDone: true},
//         {id: '2', title: 'JS', isDone: true},
//         {id: '3', title: 'ReactJS', isDone: true},
//         {id: '4', title: 'Rest API', isDone: false},
//         {id: '5', title: 'GraphQL', isDone: false}
//     ],
//     [todolistId2]: [
//         {id: '6', title: 'bread', isDone: true},
//         {id: '7', title: 'milk', isDone: true},
//         {id: '8', title: 'book', isDone: false},
//     ]
// }
//
// beforeEach( ()=> {
//     startState = {
//         [todolistId1]: [
//             {id: '1', title: 'HTML&CSS', isDone: true},
//             {id: '2', title: 'JS', isDone: true},
//             {id: '3', title: 'ReactJS', isDone: true},
//             {id: '4', title: 'Rest API', isDone: false},
//             {id: '5', title: 'GraphQL', isDone: false}
//         ],
//         [todolistId2]: [
//             {id: '6', title: 'bread', isDone: true},
//             {id: '7', title: 'milk', isDone: true},
//             {id: '8', title: 'book', isDone: false},
//         ]
//     }
// })

test('correct task should be removed', () => {
    let todolistId1 = v1()
    let todolistId2 = v1()

    let startState = {
        [todolistId1]: [
            {id: '1', title: 'HTML&CSS', isDone: true},
            {id: '2', title: 'JS', isDone: true},
            {id: '3', title: 'ReactJS', isDone: true},
            {id: '4', title: 'Rest API', isDone: false},
            {id: '5', title: 'GraphQL', isDone: false}
        ],
        [todolistId2]: [
            {id: '1', title: 'bread', isDone: true},
            {id: '2', title: 'milk', isDone: true},
            {id: '3', title: 'book', isDone: false},
        ]
    }

    const endState = tasksReducer(startState, removeTaskAC(todolistId1, '3'))

    expect(endState[todolistId1][2].id).toBe('4')
    expect(endState[todolistId1].length).toBe(4)
    expect(endState[todolistId2][2].id).toBe('3')
    expect(endState[todolistId2].length).toBe(3)
    expect(endState[todolistId1].every(t=> t.id !=='3')).toBeTruthy()
})
test('correct task should be added', () => {
    let todolistId1 = v1()
    let todolistId2 = v1()

    let startState = {
        [todolistId1]: [
            {id: '1', title: 'HTML&CSS', isDone: true},
            {id: '2', title: 'JS', isDone: true},
            {id: '3', title: 'ReactJS', isDone: true},
            {id: '4', title: 'Rest API', isDone: false},
            {id: '5', title: 'GraphQL', isDone: false}
        ],
        [todolistId2]: [
            {id: '6', title: 'bread', isDone: true},
            {id: '7', title: 'milk', isDone: true},
            {id: '8', title: 'book', isDone: false},
        ]
    }

    const endState = tasksReducer(startState, addTaskAC(todolistId2, 'test title'))

    expect(endState[todolistId2][0].title).toBe('test title')
    expect(endState[todolistId2][0].id).toBeDefined()
    expect(endState[todolistId2].length).toBe(4)
})
test('task status should be changed', () => {
    let todolistId1 = v1()
    let todolistId2 = v1()

    let startState = {
        [todolistId1]: [
            {id: '1', title: 'HTML&CSS', isDone: true},
            {id: '2', title: 'JS', isDone: true},
            {id: '3', title: 'ReactJS', isDone: true},
            {id: '4', title: 'Rest API', isDone: false},
            {id: '5', title: 'GraphQL', isDone: false}
        ],
        [todolistId2]: [
            {id: '6', title: 'bread', isDone: true},
            {id: '7', title: 'milk', isDone: true},
            {id: '8', title: 'book', isDone: false},
        ]
    }

    const endState = tasksReducer(startState, changeTaskStatusAC(todolistId1, '1', false))

    expect(endState[todolistId1][0].isDone).toBe(false)
})

test('task title should be changed', () => {
    let todolistId1 = v1()
    let todolistId2 = v1()

    let startState = {
        [todolistId1]: [
            {id: '1', title: 'HTML&CSS', isDone: true},
            {id: '2', title: 'JS', isDone: true},
            {id: '3', title: 'ReactJS', isDone: true},
            {id: '4', title: 'Rest API', isDone: false},
            {id: '5', title: 'GraphQL', isDone: false}
        ],
        [todolistId2]: [
            {id: '6', title: 'bread', isDone: true},
            {id: '7', title: 'milk', isDone: true},
            {id: '8', title: 'book', isDone: false},
        ]
    }

    const endState = tasksReducer(startState, changeTaskTitleAC(todolistId1, '1', 'test title'))

    expect(endState[todolistId1][0].title).toBe('test title')
    expect(startState[todolistId1][0].title).toBe('HTML&CSS')
})