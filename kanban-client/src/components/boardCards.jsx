import styles from './styles/BoardCards.module.scss';

const BoardCards = ({ boards, getFullBoard }) => {
  if (!Array.isArray(boards)) return null;

  return boards.map((board) => (
    <div
      key={board.id}
      className={styles.card}
      onClick={() => getFullBoard(board.id)}
    >
      <h3 className={styles.title}>{board.title}</h3>

      <div className={styles.tags}>
        {board.columns.length !== 0 ? (
          board.columns.slice(0, 4).map((col, i) => (
            <span key={i} className={styles.tag}>
              {col.title}
            </span>
          ))
        ) : (
          <span className={styles.tag}>Нет колонок</span>
        )}
        {console.log(board.columns.length)}
      </div>
    </div>
  ));
};

export default BoardCards;
