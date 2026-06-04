import { CollisionPriority } from '@dnd-kit/abstract';
import { useSortable } from '@dnd-kit/react/sortable';
import { dndTaskGroup, dndTaskId } from '../utils/dnd';
import styles from './styles/TaskCard.module.scss';

export default function TaskCard({ task, index, columnId, disabled = false }) {
  const { ref, isDragging } = useSortable({
    id: dndTaskId(task.id),
    index,
    group: dndTaskGroup(columnId),
    type: 'task',
    accept: 'task',
    disabled,
    collisionPriority: CollisionPriority.Low,
    data: { type: 'task', columnId, taskId: task.id },
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
