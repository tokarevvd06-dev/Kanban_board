import { useState } from 'react';
import { DragDropProvider, DragOverlay } from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/dom/sortable';
import SortableColumn from './SortableColumn';
import { idsEqual, parseColumnId, parseTaskId } from '../utils/dnd';
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
  onDeleteColumn,
  onOpenTask,
}) {
  const [activeItem, setActiveItem] = useState(null);
  const [draggingColumn, setDraggingColumn] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [columnTitle, setColumnTitle] = useState('');

  const handleDragStart = (event) => {
    const { source } = event.operation;
    if (!source) return;

    const data = source.data ?? {};

    if (data.type === 'column') {
      setDraggingColumn(true);
      const colId = data.columnId ?? parseColumnId(source.id);
      const column = columns.find((c) => idsEqual(c.id, colId));
      if (column) setActiveItem({ type: 'column', ...column });
      return;
    }

    if (data.type === 'task') {
      const taskId = data.taskId ?? parseTaskId(source.id);
      for (const col of columns) {
        const task = col.tasks?.find((t) => idsEqual(t.id, taskId));
        if (task) {
          setActiveItem({ type: 'task', ...task });
          break;
        }
      }
    }
  };

  const handleDragEnd = async (event) => {
    setActiveItem(null);
    setDraggingColumn(false);

    if (event.canceled) return;

    const { source, target } = event.operation;
    if (!source || !isSortable(source)) return;

    const sortable = source.sortable;
    const data = source.data ?? {};

    if (data.type === 'column') {
      const fromIndex = sortable.initialIndex;
      let toIndex = sortable.index;

      if (target && isSortable(target)) {
        const targetData = target.data ?? {};
        if (targetData.type === 'column') {
          const targetColId =
            targetData.columnId ?? parseColumnId(target.id);
          const idx = columns.findIndex((c) => idsEqual(c.id, targetColId));
          if (idx !== -1) toIndex = idx;
        }
      }

      if (fromIndex === toIndex || toIndex < 0) return;

      const prev = columns;
      const reordered = arrayMove(prev, fromIndex, toIndex);
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
      const taskId = data.taskId ?? parseTaskId(source.id);
      const fromColumnId =
        parseColumnId(sortable.initialGroup) ?? data.columnId;
      let toColumnId = parseColumnId(sortable.group);
      let newIndex = sortable.index;

      if (target && !isSortable(target)) {
        toColumnId = parseColumnId(target.id);
        const toCol = columns.find((c) => idsEqual(c.id, toColumnId));
        newIndex = toCol?.tasks?.length ?? 0;
      }

      if (
        !taskId ||
        !fromColumnId ||
        !toColumnId ||
        (sortable.initialIndex === newIndex &&
          idsEqual(fromColumnId, toColumnId))
      ) {
        return;
      }

      const prev = columns;
      const next = columns.map((col) => ({
        ...col,
        tasks: [...(col.tasks ?? [])],
      }));

      const fromCol = next.find((c) => idsEqual(c.id, fromColumnId));
      const toCol = next.find((c) => idsEqual(c.id, toColumnId));
      if (!fromCol || !toCol) return;

      const taskIdx = fromCol.tasks.findIndex((t) => idsEqual(t.id, taskId));
      if (taskIdx === -1) return;

      const [task] = fromCol.tasks.splice(taskIdx, 1);
      toCol.tasks.splice(newIndex, 0, task);
      setColumns(next);

      try {
        await onMoveTask({
          taskId,
          fromColumnId,
          toColumnId,
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

    try {
      await onCreateColumn(title);
      setColumnTitle('');
      setShowForm(false);
    } catch (err) {
      console.error(err.response?.data?.message ?? err.message);
    }
  };

  return (
    <DragDropProvider onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className={styles.board}>
        {columns.map((column, index) => (
          <SortableColumn
            key={column.id}
            column={column}
            index={index}
            onCreateTask={onCreateTask}
            onDeleteColumn={onDeleteColumn}
            onOpenTask={onOpenTask}
            tasksDisabled={draggingColumn}
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
