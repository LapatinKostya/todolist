import React from 'react'
import {Task} from './Task'
import {ReduxStoreProviderDecorator} from '../../../../stories/decorators/ReduxStoreProviderDecorator'
import {TaskPriorities, TaskStatuses} from "../../../../api/todolists-api";

export default {
    title: 'Task Stories',
    component: Task,
    decorators: [ReduxStoreProviderDecorator]
}

// const removeCallback = action('Remove Button inside Task clicked');
// const changeStatusCallback = action('Status changed inside Task');
// const changeTitleCallback = action('Title changed inside Task');

export const TaskBaseExample = (props: any) => {
    return (
        <div>
            <Task
                isDisabled={false}
                task={{id: '1', status: TaskStatuses.Completed, title: "CSS", todoListId: "todolistId1", description: '',
                    startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low}}
                todolistId={"todolistId1"}
            />
            <Task
                isDisabled={false}
                task={{id: '2', status: TaskStatuses.New, title: "JS", todoListId: "todolistId1", description: '',
                    startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low}}
                todolistId={"todolistId2"}
            />
          <Task
              isDisabled={true}
              task={{id: '2', status: TaskStatuses.New, title: "TEST", todoListId: "todolistId1", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low}}
              todolistId={"todolistId2"}
          />
        </div>)
}