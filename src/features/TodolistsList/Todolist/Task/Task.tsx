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
  changeTaskStatus: (todolistId: string, id: string, status: TaskStatuses) => void
  changeTaskTitle: (todolistId: string, taskId: string, newTitle: string) => void
  // removeTask: (params: { todolistId: string, taskId: string }) => void
  entityTaskStatus: RequestStatusType

}
export const Task = React.memo((props: TaskPropsType) => {
  const {removeTask} = useActions()

  const onClickHandler = useCallback(() => removeTask({
    todolistId: props.todolistId,
    taskId: props.task.id
  }), [props.task.id, props.todolistId]);
  const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const newIsDoneValue = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
    props.changeTaskStatus(props.todolistId, props.task.id, newIsDoneValue)
  }, [props.task.id, props.todolistId]);

  const onTitleChangeHandler = useCallback((newValue: string) => {
    props.changeTaskTitle(props.todolistId, props.task.id, newValue)
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
    <IconButton onClick={onClickHandler} disabled={isDisabled}>
      <Delete/>
    </IconButton>
  </div>
})
