import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/api';
import { createColumn, reorderColumns } from '../api/columns';
import { createTask, moveTask } from '../api/tasks';
import Columns from '../components/Columns';
import styles from './styles/BoardPage.module.scss';

export default function BoardPage() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBoard = useCallback(async () => {
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
  }, [id]);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  const handleCreateColumn = async (title) => {
    const newColumn = await createColumn(Number(id), title);
    setColumns((prev) => [...prev, { ...newColumn, tasks: [] }]);
  };

  const handleCreateTask = async (columnId, title) => {
    const newTask = await createTask(columnId, title);
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, tasks: [...(col.tasks ?? []), newTask] }
          : col,
      ),
    );
  };

  const handleReorderColumns = async (columnsPayload) => {
    await reorderColumns(Number(id), columnsPayload);
  };

  const handleMoveTask = async (payload) => {
    await moveTask(payload);
  };

  if (loading) {
    return <div className={styles.page}><p className={styles.status}>Загрузка...</p></div>;
  }

  if (error) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>{error}</p>
        <Link to="/boards" className={styles.backLink}>← К доскам</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Link to="/boards" className={styles.backLink}>← К доскам</Link>
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
        />
      </div>
    </div>
  );
}
