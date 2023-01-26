import React, {ChangeEvent, useCallback} from 'react'
import {EditableSpan} from '../../../../components/EditableSpan/EditableSpan'
import {Delete} from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import {TaskStatuses, TaskType} from "../../../../api/todolists-api";
import {useActions} from "../../../../utils/hooks/useActions";

type TaskPropsType = {
  task: TaskType
  todolistId: string
  isDisabled: boolean

}
export const Task = React.memo(({task, todolistId, isDisabled}: TaskPropsType) => {
  const {removeTask, updateTask} = useActions()

  const removeTaskHandler = useCallback(() => removeTask({
    todolistId: todolistId,
    taskId: task.id
  }), [task.id, todolistId])

  const changeTaskStatusHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const newIsDoneValue = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
    updateTask({todolistId, taskId: task.id, domainModel: {status: newIsDoneValue}})
  }, [task.id, todolistId])

  const changeTaskTitleHandler = useCallback((newTitle: string) => {
    updateTask({todolistId, taskId: task.id, domainModel: {title: newTitle}})
  }, [task.id, todolistId])

  return (
      <div key={task.id} className={task.status === TaskStatuses.Completed ? 'is-done' : ''}>
        <Checkbox
            checked={task.status === TaskStatuses.Completed}
            color="primary"
            onChange={changeTaskStatusHandler}
            disabled={isDisabled}
        />

        <EditableSpan value={task.title} onChange={changeTaskTitleHandler} isDisabled={isDisabled}/>
        <IconButton onClick={removeTaskHandler} disabled={isDisabled}>
          <Delete/>
        </IconButton>
      </div>
  )
})
