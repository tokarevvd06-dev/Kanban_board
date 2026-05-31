import { useSortable } from '@dnd-kit/react/sortable';
import styles from './styles/TaskCard.module.scss';

export default function TaskCard({ task, index, columnId }) {
  const { ref, isDragging } = useSortable({
    id: String(task.id),
    index,
    group: String(columnId),
    type: 'task',
    data: { type: 'task', columnId },
  });

  return (
    <div
      ref={ref}
      className={`${styles.card} ${isDragging ? styles.dragging : ''}`}
    >
      <p className={styles.title}>{task.title}</p>
      {task.description && (
        <p className={styles.description}>{task.description}</p>
      )}
    </div>
  );
}
