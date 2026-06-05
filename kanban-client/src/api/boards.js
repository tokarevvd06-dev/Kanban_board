import api from './api';

export const postNewBoard = async (title) => {
  const data = await api.post('/boards', { title });
  return data.data;
};

export const deleteBoard = async (boardId) => {
  if (!boardId) {
    throw new Error('Некорректный id доски');
  }

  const resp = await api.delete(`/boards/${boardId}`);
  return resp.data;
};
