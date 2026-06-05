import styles from './styles/BoardCards.module.scss';

const BoardCards = ({ boards, getFullBoard, onDeleteBoard }) => {
  if (!Array.isArray(boards)) return null;

  return boards.map((board) => (
    <div
      key={board.id}
      className={styles.card}
      onClick={() => getFullBoard(board.id)}
    >
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>{board.title}</h3>
        <button
          type="button"
          className={styles.deleteBtn}
          title="Удалить доску"
          aria-label="Удалить доску"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteBoard(board.id);
          }}
        >
          ×
        </button>
      </div>

      <div className={styles.tags}>
        {board.columns.length !== 0 ? (
          board.columns.slice(0, 4).map((col) => (
            <span key={col.id} className={styles.tag}>
              {col.title}
            </span>
          ))
        ) : (
          <span className={styles.noColumns}>Нет колонок</span>
        )}
      </div>
    </div>
  ));
};

export default BoardCards;
