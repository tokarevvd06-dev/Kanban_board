import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/api';
import { createColumn, deleteColumn, reorderColumns } from '../api/columns';
import { createTask, moveTask } from '../api/tasks';
import TaskModal from '../components/TaskModal';
import Columns from '../components/Columns';
import styles from './styles/BoardPage.module.scss';
import arrowLeft from '../../public/arrow-left.png';

export default function BoardPage() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  // const fetchBoard = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const resp = await api.get(`/boards/${id}/full`);
  //     setBoard(resp.data.data.board);
  //     setColumns(resp.data.data.columns ?? []);
  //   } catch (err) {
  //     setError(err.response?.data?.message ?? 'Не удалось загрузить доску');
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [id]);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        setLoading(true);
        setError(null);
        const resp = await api.get(`/boards/${id}/full`);
        setBoard(resp.data.data.board);
        setColumns(resp.data.data.columns ?? []);
      } catch (err) {
        setError(err.response?.data?.message ?? 'Не удалось загрузить доску');
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, []);

  const handleCreateColumn = async (title) => {
    const newColumn = await createColumn(id, title);
    setColumns((prev) => [...prev, { ...newColumn, tasks: [] }]);
  };

  const handleCreateTask = async (columnId, title) => {
    const newTask = await createTask(columnId, title);
    setColumns((prev) =>
      prev.map((col) =>
        String(col.id) === String(columnId)
          ? { ...col, tasks: [...(col.tasks ?? []), newTask] }
          : col
      )
    );
  };

  const handleReorderColumns = async (columnsPayload) => {
    await reorderColumns(id, columnsPayload);
  };

  const handleMoveTask = async (payload) => {
    await moveTask(payload);
  };

  const handleDeleteColumn = async (columnId) => {
    if (!window.confirm('Удалить колонку и все её задачи?')) return;

    try {
      await deleteColumn(columnId);
      setColumns((prev) => prev.filter((col) => String(col.id) !== String(columnId)));
    } catch (err) {
      console.error(err.response?.data?.message ?? err.message);
    }
  };

  const handleDeleteTask = (taskId, columnId) => {
    setColumns((prev) =>
      prev.map((col) =>
        String(col.id) === String(columnId)
          ? {
              ...col,
              tasks: (col.tasks ?? []).filter(
                (t) => String(t.id) !== String(taskId),
              ),
            }
          : col,
      ),
    );
  };

  const handleOpenTask = (task, columnId) => {
    setSelectedTask({ task, columnId });
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.status}>Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>{error}</p>
        <Link to="/boards" className={styles.backLink}>
          <div>
            <img src={arrowLeft} alt="arrow-left" />
            <h1>Назад</h1>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Link to="/boards" className={styles.backLink}>
            <div className={styles.backLink}>
              <svg
                xmlns="http://w3.org"
                width="24"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#a3a3a3"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>

              <p>Назад</p>
            </div>
          </Link>
          <h1 className={styles.title}>{board.title}</h1>
        </div>
      </header>

      <div className={styles.workspace}>
        <Columns
          columns={columns}
          setColumns={setColumns}
          onCreateColumn={handleCreateColumn}
          onCreateTask={handleCreateTask}
          onReorderColumns={handleReorderColumns}
          onMoveTask={handleMoveTask}
          onDeleteColumn={handleDeleteColumn}
          onOpenTask={handleOpenTask}
        />
      </div>

      {selectedTask && (
        <TaskModal
          task={selectedTask.task}
          columnId={selectedTask.columnId}
          onClose={() => setSelectedTask(null)}
          onDeleteTask={handleDeleteTask}
        />
      )}
    </div>
  );
}
