import { useState } from 'react';
import { useDroppable } from '@dnd-kit/react';
import { dndDropId } from '../utils/dnd';
import TaskCard from './TaskCard';
import styles from './styles/Column.module.scss';

export default function Column({
  column,
  onCreateTask,
  onOpenTask,
  onDeleteColumn,
  tasksDisabled = false,
  hideHeader = false,
}) {
  const [taskTitle, setTaskTitle] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { ref: dropRef, isDropTarget } = useDroppable({
    id: dndDropId(column.id),
    type: 'task',
    accept: 'task',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = taskTitle.trim();
    if (!title) return;

    await onCreateTask(column.id, title);
    setTaskTitle('');
    setShowForm(false);
  };

  return (
    <div className={styles.column}>
      {!hideHeader && (
        <div className={styles.header}>
          <h2 className={styles.title}>{column.title}</h2>
          <span className={styles.count}>{column.tasks?.length ?? 0}</span>
        </div>
      )}

      <div
        ref={dropRef}
        className={`${styles.tasks} ${isDropTarget ? styles.dropTarget : ''}`}
      >
        {column.tasks.length > 0 ? (
          column.tasks.map((task, taskIndex) => (
            <TaskCard
              key={task.id}
              task={task}
              index={taskIndex}
              columnId={column.id}
              disabled={tasksDisabled}
              onOpen={() => onOpenTask?.(task, column.id)}
            />
          ))
        ) : (
          <h4>Нет задач</h4>
        )}
      </div>

      {showForm ? (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            autoFocus
            type="text"
            placeholder="Название задачи"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className={styles.input}
          />
          <div className={styles.formActions}>
            <button type="submit" className={styles.addBtn}>
              Добавить
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => {
                setShowForm(false);
                setTaskTitle('');
              }}
            >
              Отмена
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.addTaskBtnContainer}>
          <button
            type="button"
            className={styles.addTaskBtn}
            onClick={() => setShowForm(true)}
          >
            + Добавить задачу
          </button>
          <button
            type="button"
            className={styles.deleteBtn}
            title="Удалить колонку"
            aria-label="Удалить колонку"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteColumn(column.id);
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
