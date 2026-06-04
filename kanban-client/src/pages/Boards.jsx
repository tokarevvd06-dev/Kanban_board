import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useState, useEffect } from 'react';
import BoardCards from '../components/BoardCards';
import { useAuthStore } from '../store/authStore';
import styles from './styles/Boards.module.scss';
export default function Boards() {
  const logout = useAuthStore((s) => s.logout);

  const [boards, setBoards] = useState([]);
  const [loading, setLoad] = useState(true);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [title, setTitle] = useState('New Kanban Board');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await api.get('/boards/my');
        setBoards(resp.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        console.log('operation completed');
        setLoad(false);
      }
    };
    fetchData();
  }, []);

  const getFullBoard = async (id) => {
    navigate(`/board-page/${id}`);
  };

  const createBoard = async (title) => {
    const resp = await api.post('/boards', { title: title });
    console.log(resp);
  };

  const signOut = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Ваши доски</h1>

        <button onClick={signOut} className={styles.button}>
          Выйти
        </button>
      </div>
      {boards.length === 0 ? (
        <h2>У вас ещё нет досок...</h2>
      ) : (
        <div className={styles.cards}>
          <BoardCards boards={boards} getFullBoard={getFullBoard} />
        </div>
      )}

      <div className={styles.section}>
        {!showCreateBoard ? (
          <button
            onClick={() => setShowCreateBoard(showCreateBoard ? false : true)}
            className={styles.button}
          >
            Создать доску
          </button>
        ) : (
          <button
            onClick={() => setShowCreateBoard(showCreateBoard ? false : true)}
            className={styles.button}
          >
            Отменить
          </button>
        )}
        {showCreateBoard && (
          <form className={styles.form}>
            <input
              type="text"
              placeholder="Название доски"
              className={styles.input}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button
              onClick={() => createBoard(title)}
              className={`${styles.button} ${styles.createButton}`}
            >
              Создать
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
