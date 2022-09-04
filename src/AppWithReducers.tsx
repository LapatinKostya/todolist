import React, {useReducer} from 'react';
import './App.css';
import {Todolist} from "./components/Todolist";
import {v1} from "uuid";
import {AddItemForm} from "./components/AddItemForm";
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    todolistsReducer
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./state/tasks-reducer";

export type filterType = 'all' | 'active' | 'completed'

function AppWidthReducers() {
    const todolistId1 = v1()
    const todolistId2 = v1()

    const [todolists, dispatchTodolistsReducer] = useReducer(todolistsReducer, [
        {id: todolistId1, title: 'What to learn', filter: 'all'},
        {id: todolistId2, title: 'What to bye', filter: 'all'},
    ])

    const [tasks, dispatchTasksReducer] = useReducer(tasksReducer, {
        [todolistId1]: [
            {id: v1(), title: 'HTML&CSS', isDone: true},
            {id: v1(), title: 'JS', isDone: true},
            {id: v1(), title: 'ReactJS', isDone: true},
            {id: v1(), title: 'Rest API', isDone: false},
            {id: v1(), title: 'GraphQL', isDone: false}
        ],
        [todolistId2]: [
            {id: v1(), title: 'bread', isDone: true},
            {id: v1(), title: 'milk', isDone: true},
            {id: v1(), title: 'book', isDone: false},
        ]
    })

    const addTodoList = (title: string) => {
        const action = addTodolistAC(title)
        dispatchTodolistsReducer(action)
        dispatchTasksReducer(action)
    }
    const removeTodolist = (todoId: string) => {
        const action = removeTodolistAC(todoId)
        dispatchTodolistsReducer(action)
        dispatchTasksReducer(action)
    }
    const changeTodolistFilter = (value: filterType, toDoId: string) => {
        dispatchTodolistsReducer(changeTodolistFilterAC(toDoId, value))
    }
    const changeTodolistTitle = (todoId: string, value: string) => {
        dispatchTodolistsReducer(changeTodolistTitleAC(todoId, value))
    }

    const removeTask = (toDoId: string, id: string) => {
        dispatchTasksReducer(removeTaskAC(toDoId, id))
    }
    const addTask = (toDoId: string, task: string) => {
        dispatchTasksReducer(addTaskAC(toDoId, task))
    }
    const changeTaskStatus = (toDoId: string, id: string, isDone: boolean) => {
        dispatchTasksReducer(changeTaskStatusAC(toDoId, id, isDone))
    }
    const changeTaskTitle = (todoId: string, taskId: string, value: string) => {
        dispatchTasksReducer(changeTaskTitleAC(todoId, taskId, value))
    }

    return (
        <div className="App">
            <AddItemForm addItem={addTodoList}/>
            {todolists.map((tl) => {

                let tasksForTodolist = tasks[tl.id]

                if (tl.filter === 'active') {
                    tasksForTodolist = tasksForTodolist.filter(el => !el.isDone)
                }
                if (tl.filter === 'completed') {
                    tasksForTodolist = tasksForTodolist.filter(el => el.isDone)
                }
                return (
                    <Todolist
                        key={tl.id}
                        id={tl.id}
                        title={tl.title}
                        filter={tl.filter}
                        tasks={tasksForTodolist}
                        removeTask={removeTask}
                        changeFilter={changeTodolistFilter}
                        addTask={addTask}
                        changeTaskStatus={changeTaskStatus}
                        removeTodolist={removeTodolist}
                        changeTaskTitle={changeTaskTitle}
                        changeTodolistTitle={changeTodolistTitle}
                    />
                )
            })}
        </div>
    );
}

export default AppWidthReducers;
