import { useState } from 'react';
import { useSortable } from '@dnd-kit/react/sortable';
import { useDroppable } from '@dnd-kit/react';
import TaskCard from './TaskCard';
import styles from './styles/Column.module.scss';

export default function Column({
  column,
  index,
  onCreateTask,
}) {
  const [taskTitle, setTaskTitle] = useState('');
  const [showForm, setShowForm] = useState(false);

  const {
    ref: columnRef,
    handleRef,
    isDragging,
  } = useSortable({
    id: `column-${column.id}`,
    index,
    group: 'columns',
    type: 'column',
    data: { type: 'column' },
  });

  const { ref: dropRef, isDropTarget } = useDroppable({
    id: String(column.id),
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
    <div
      ref={columnRef}
      className={`${styles.column} ${isDragging ? styles.dragging : ''}`}
    >
      <div ref={handleRef} className={styles.header}>
        <h2 className={styles.title}>{column.title}</h2>
        <span className={styles.count}>{column.tasks?.length ?? 0}</span>
      </div>

      <div
        ref={dropRef}
        className={`${styles.tasks} ${isDropTarget ? styles.dropTarget : ''}`}
      >
        {column.tasks?.map((task, taskIndex) => (
          <TaskCard
            key={task.id}
            task={task}
            index={taskIndex}
            columnId={column.id}
          />
        ))}
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
        <button
          type="button"
          className={styles.addTaskBtn}
          onClick={() => setShowForm(true)}
        >
          + Добавить задачу
        </button>
      )}
    </div>
  );
}
