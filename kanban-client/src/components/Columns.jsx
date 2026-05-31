import { useState } from 'react';
import { DragDropProvider, DragOverlay } from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/dom/sortable';
import Column from './Column';
import styles from './styles/Columns.module.scss';

function arrayMove(array, from, to) {
  const result = [...array];
  const [item] = result.splice(from, 1);
  result.splice(to, 0, item);
  return result;
}

export default function Columns({
  columns,
  setColumns,
  onCreateColumn,
  onCreateTask,
  onReorderColumns,
  onMoveTask,
}) {
  const [activeItem, setActiveItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [columnTitle, setColumnTitle] = useState('');

  const handleDragStart = (event) => {
    const { source } = event.operation;
    if (!source) return;

    const data = source.data ?? {};

    if (data.type === 'column') {
      const colId = String(source.id).replace('column-', '');
      const column = columns.find((c) => String(c.id) === colId);
      if (column) setActiveItem({ type: 'column', ...column });
      return;
    }

    if (data.type === 'task') {
      for (const col of columns) {
        const task = col.tasks?.find((t) => String(t.id) === String(source.id));
        if (task) {
          setActiveItem({ type: 'task', ...task });
          break;
        }
      }
    }
  };

  const handleDragEnd = async (event) => {
    setActiveItem(null);

    if (event.canceled) return;

    const { source, target } = event.operation;
    if (!source || !isSortable(source)) return;

    const sortable = source.sortable;
    const data = source.data ?? {};

    if (data.type === 'column') {
      if (sortable.initialIndex === sortable.index) return;

      const prev = columns;
      const reordered = arrayMove(prev, sortable.initialIndex, sortable.index);
      setColumns(reordered);

      try {
        await onReorderColumns(
          reordered.map((col, i) => ({ id: col.id, position: i + 1 })),
        );
      } catch {
        setColumns(prev);
      }
      return;
    }

    if (data.type === 'task') {
      const taskId = source.id;
      let fromColumnId = sortable.initialGroup;
      let toColumnId = sortable.group;
      let newIndex = sortable.index;

      if (target && !isSortable(target)) {
        toColumnId = target.id;
        const toCol = columns.find((c) => String(c.id) === String(toColumnId));
        newIndex = toCol?.tasks?.length ?? 0;
      }

      if (
        sortable.initialIndex === newIndex &&
        String(fromColumnId) === String(toColumnId)
      ) {
        return;
      }

      const prev = columns;
      const next = columns.map((col) => ({
        ...col,
        tasks: [...(col.tasks ?? [])],
      }));

      const fromCol = next.find((c) => String(c.id) === String(fromColumnId));
      const toCol = next.find((c) => String(c.id) === String(toColumnId));
      if (!fromCol || !toCol) return;

      const taskIdx = fromCol.tasks.findIndex(
        (t) => String(t.id) === String(taskId),
      );
      if (taskIdx === -1) return;

      const [task] = fromCol.tasks.splice(taskIdx, 1);
      toCol.tasks.splice(newIndex, 0, task);
      setColumns(next);

      try {
        await onMoveTask({
          taskId: task.id,
          fromColumnId: Number(fromColumnId),
          toColumnId: Number(toColumnId),
          newPosition: newIndex + 1,
        });
      } catch {
        setColumns(prev);
      }
    }
  };

  const handleCreateColumn = async (e) => {
    e.preventDefault();
    const title = columnTitle.trim();
    if (!title) return;

    await onCreateColumn(title);
    setColumnTitle('');
    setShowForm(false);
  };

  return (
    <DragDropProvider onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className={styles.board}>
        {columns.map((column, index) => (
          <Column
            key={column.id}
            column={column}
            index={index}
            onCreateTask={onCreateTask}
          />
        ))}

        <div className={styles.addColumn}>
          {showForm ? (
            <form className={styles.form} onSubmit={handleCreateColumn}>
              <input
                autoFocus
                type="text"
                placeholder="Название колонки"
                value={columnTitle}
                onChange={(e) => setColumnTitle(e.target.value)}
                className={styles.input}
              />
              <div className={styles.formActions}>
                <button type="submit" className={styles.submitBtn}>
                  Создать
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => {
                    setShowForm(false);
                    setColumnTitle('');
                  }}
                >
                  Отмена
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              className={styles.addBtn}
              onClick={() => setShowForm(true)}
            >
              + Добавить колонку
            </button>
          )}
        </div>
      </div>

      <DragOverlay>
        {activeItem?.type === 'column' && (
          <div className={styles.overlayColumn}>
            <h2>{activeItem.title}</h2>
          </div>
        )}
        {activeItem?.type === 'task' && (
          <div className={styles.overlayTask}>
            <p>{activeItem.title}</p>
          </div>
        )}
      </DragOverlay>
    </DragDropProvider>
  );
}
