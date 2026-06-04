import { CollisionPriority } from '@dnd-kit/abstract';
import { useSortable } from '@dnd-kit/react/sortable';
import { dndColumnId } from '../utils/dnd';
import Column from './Column';
import styles from './styles/SortableColumn.module.scss';

export default function SortableColumn({
  column,
  index,
  onCreateTask,
  tasksDisabled,
}) {
  const {
    ref: columnRef,
    handleRef,
    isDragging,
  } = useSortable({
    id: dndColumnId(column.id),
    index,
    group: 'columns',
    type: 'column',
    accept: 'column',
    collisionPriority: CollisionPriority.High,
    data: { type: 'column', columnId: column.id },
  });

  return (
    <div
      ref={columnRef}
      className={`${styles.wrapper} ${isDragging ? styles.dragging : ''}`}
    >
      <div ref={handleRef} className={styles.handle} title="Перетащить колонку">
        <span className={styles.grip} aria-hidden />
        <span className={styles.handleTitle}>{column.title}</span>
        <span className={styles.count}>{column.tasks?.length ?? 0}</span>
      </div>
      <Column
        column={column}
        onCreateTask={onCreateTask}
        tasksDisabled={tasksDisabled}
        hideHeader
      />
    </div>
  );
}
