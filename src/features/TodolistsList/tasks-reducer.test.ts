import {TasksStateType} from './tasks-reducer'
import {taskActions, tasksReducer, todolistActions} from "./";
import {TaskPriorities, TaskStatuses} from "../../api/types";

let startState: TasksStateType = {};
beforeEach(() => {
  startState = {
    "todolistId1": [
      {
        id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
        startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityTaskStatus: 'idle'
      },
      {
        id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
        startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityTaskStatus: 'idle'
      },
      {
        id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
        startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityTaskStatus: 'idle'
      }
    ],
    "todolistId2": [
      {
        id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
        startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityTaskStatus: 'idle'
      },
      {
        id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
        startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityTaskStatus: 'idle'
      },
      {
        id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
        startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityTaskStatus: 'idle'
      }
    ]
  }
})

test('correct task should be deleted from correct array', () => {
  const param = {taskId: "2", todolistId: "todolistId2"}
  const action = taskActions.removeTask.fulfilled(param, 'requestId', {
    taskId: "2",
    todolistId: "todolistId2"
  });

  const endState = tasksReducer(startState, action)

  expect(endState["todolistId1"].length).toBe(3)
  expect(endState["todolistId2"].length).toBe(2)
  expect(endState["todolistId2"].every(t => t.id !== "2")).toBeTruthy()
})
test('correct task should be added to correct array', () => {
  const task = {
    todoListId: "todolistId2",
    title: "juice",
    status: TaskStatuses.New,
    addedDate: "",
    deadline: "",
    description: "",
    order: 0,
    priority: 0,
    startDate: "",
    id: "id exists"
  }
  const action = taskActions.addTask.fulfilled(task, '', {
    todolistId: task.todoListId,
    title: task.title
  })

  const endState = tasksReducer(startState, action)

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(4);
  expect(endState["todolistId2"][0].id).toBeDefined();
  expect(endState["todolistId2"][0].title).toBe("juice");
  expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
});
test('new array should be added when new todolist is added', () => {
  const todolist = {
    id: "test",
    title: "new todolist",
    order: 0,
    addedDate: ''
  }
  const action = todolistActions.addTodolist.fulfilled({todolist}, '', todolist)

  const endState = tasksReducer(startState, action)


  const keys = Object.keys(endState);
  const newKey = keys.find(k => k !== "todolistId1" && k !== "todolistId2");
  if (!newKey) {
    throw Error("new key should be added")
  }

  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});
test('property with todolistId should be deleted', () => {
  const params = {todolistId: "todolistId2"}
  const action = todolistActions.removeTodolist.fulfilled(params, '', params);

  const endState = tasksReducer(startState, action)

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState["todolistId2"]).not.toBeDefined();
});
test('empty arrays should be added when we set todolists', () => {
  const action = todolistActions.fetchTodolists.fulfilled({
    todolists: [
      {id: "1", title: "title 1", order: 0, addedDate: ""},
      {id: "2", title: "title 2", order: 0, addedDate: ""}
    ]
  }, '', undefined)

  const endState = tasksReducer({}, action)

  const keys = Object.keys(endState)

  expect(keys.length).toBe(2)
  expect(endState['1']).toBeDefined()
  expect(endState['2']).toBeDefined()
})
test('tasks should be added for todolist', () => {
  const action = taskActions.fetchTasks.fulfilled({
    tasks: startState["todolistId1"],
    todolistId: "todolistId1"
  }, '', "todolistId1");

  const endState = tasksReducer({
    "todolistId2": [],
    "todolistId1": []
  }, action)

  expect(endState["todolistId1"].length).toBe(3)
  expect(endState["todolistId2"].length).toBe(0)
})

