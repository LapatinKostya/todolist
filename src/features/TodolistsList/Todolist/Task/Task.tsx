import React, {ChangeEvent, useCallback} from 'react'
import {EditableSpan} from '../../../../components/EditableSpan/EditableSpan'
import {Delete} from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import {TaskStatuses, TaskType} from "../../../../api/todolists-api";
import {RequestStatusType} from "../../../../app/app-reducer";
import {useActions} from "../../../../utils/hooks/useActions";

type TaskPropsType = {
  task: TaskType
  todolistId: string
  entityTaskStatus: RequestStatusType

}
export const Task = React.memo((props: TaskPropsType) => {
  const {removeTask, updateTask } = useActions()

  const deleteTaskHandler = useCallback(() => removeTask({
    todolistId: props.todolistId,
    taskId: props.task.id
  }), [props.task.id, props.todolistId]);

  const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const newIsDoneValue = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
    updateTask({todolistId: props.todolistId, taskId: props.task.id, domainModel: {status: newIsDoneValue}})
  }, [props.task.id, props.todolistId]);

  const onTitleChangeHandler = useCallback((newTitle: string) => {
    updateTask({ todolistId:props.todolistId, taskId:props.task.id,domainModel: {title: newTitle}})
  }, [props.task.id, props.todolistId]);

  const isDisabled = props.entityTaskStatus === 'loading'

  return <div key={props.task.id} className={props.task.status === TaskStatuses.Completed ? 'is-done' : ''}>
    <Checkbox
        checked={props.task.status === TaskStatuses.Completed}
        color="primary"
        onChange={onChangeHandler}
        disabled={isDisabled}
    />

    <EditableSpan value={props.task.title} onChange={onTitleChangeHandler} isDisabled={isDisabled}/>
    <IconButton onClick={deleteTaskHandler} disabled={isDisabled}>
      <Delete/>
    </IconButton>
  </div>
})
