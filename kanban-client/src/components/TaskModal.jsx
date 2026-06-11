import { useEffect, useState } from 'react';
import {
  createComment,
  deleteComment,
  getTaskComments,
} from '../api/comments';
import { deleteTask } from '../api/tasks';
import { useAuthStore } from '../store/authStore';
import styles from './styles/TaskModal.module.scss';

export default function TaskModal({ task, columnId, onClose, onDeleteTask }) {
  const user = useAuthStore((s) => s.user);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const data = await getTaskComments(task.id);
        if (!cancelled) setComments(data);
      } catch (err) {
        console.error(err.response?.data?.message ?? err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [task.id]);

  const handleDeleteTask = async () => {
    if (!window.confirm('Удалить задачу?')) return;

    try {
      await deleteTask(task.id);
      onDeleteTask(task.id, columnId);
      onClose();
    } catch (err) {
      console.error(err.response?.data?.message ?? err.message);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    const content = commentText.trim();
    if (!content) return;

    try {
      setSubmitting(true);
      const created = await createComment(task.id, content);
      setComments((prev) => [
        ...prev,
        { ...created, email: user?.email ?? created.email },
      ]);
      setCommentText('');
    } catch (err) {
      console.error(err.response?.data?.message ?? err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Удалить комментарий?')) return;

    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error(err.response?.data?.message ?? err.message);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
      >
        <header className={styles.header}>
          <h2 id="task-modal-title" className={styles.title}>
            {task.title}
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Закрыть"
          >
            ×
          </button>
        </header>

        {task.description && (
          <p className={styles.description}>{task.description}</p>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={handleDeleteTask}
          >
            Удалить задачу
          </button>
        </div>

        <section className={styles.comments}>
          <h3 className={styles.commentsTitle}>Комментарии</h3>

          {loading ? (
            <p className={styles.muted}>Загрузка...</p>
          ) : comments.length === 0 ? (
            <p className={styles.muted}>Комментариев пока нет</p>
          ) : (
            <ul className={styles.commentList}>
              {comments.map((comment) => (
                <li key={comment.id} className={styles.commentItem}>
                  <div className={styles.commentMeta}>
                    <span className={styles.author}>
                      {comment.email ?? 'Пользователь'}
                    </span>
                    {user?.id === comment.author_id && (
                      <button
                        type="button"
                        className={styles.commentDelete}
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                  <p className={styles.commentContent}>{comment.content}</p>
                </li>
              ))}
            </ul>
          )}

          <form className={styles.commentForm} onSubmit={handleAddComment}>
            <textarea
              className={styles.commentInput}
              placeholder="Написать комментарий..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={2}
            />
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={submitting}
            >
              Отправить
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
