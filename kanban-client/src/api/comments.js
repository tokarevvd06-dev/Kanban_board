import api from './api';

export const getTaskComments = async (taskId) => {
  if (!taskId) {
    throw new Error('Некорректный id задачи');
  }

  const resp = await api.get(`/comments/task/${taskId}`);
  return resp.data.data;
};

export const createComment = async (taskId, content) => {
  const trimmed = content?.trim();
  if (!taskId || !trimmed) {
    throw new Error('Некорректные данные комментария');
  }

  const resp = await api.post(`/comments/task/${taskId}`, { content: trimmed });
  return resp.data.data;
};

export const deleteComment = async (commentId) => {
  if (!commentId) {
    throw new Error('Некорректный id комментария');
  }

  const resp = await api.delete(`/comments/${commentId}`);
  return resp.data;
};
