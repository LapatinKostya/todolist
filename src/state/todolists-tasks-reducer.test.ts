import {v1} from "uuid";
import {addTodolistAC, removeTodolistAC, todolistsReducer} from "./todolists-reducer";
import {tasksReducer} from "./tasks-reducer";
import {TaskStateType, TodolistType} from "../App";

test('correct todolist should be added', () => {
    let todolistId1 = v1()
    let todolistId2 = v1()

    let newTodolistTitle = 'New Todolist'

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

    const endState = tasksReducer(startState, addTodolistAC(newTodolistTitle))

    expect(Object.keys(endState).length).toBe(3)
})

test('correct todolist should be removed', () => {

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

    const endState = tasksReducer(startState, removeTodolistAC(todolistId2))

    expect(Object.keys(endState).length).toBe(1)
    expect(endState[todolistId2]).toBe(undefined)
})
test('ids should be equals', () => {

   const startTasksState: TaskStateType = {}
   const startTodolistsState: TodolistType[] = []

    const action = addTodolistAC('www')

    const endTasksState = tasksReducer(startTasksState, action)
    const  endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(idFromTodolists)
})