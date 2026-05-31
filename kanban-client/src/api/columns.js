import api from './api';

export const createColumn = async (boardId, title) => {
  const resp = await api.post('/columns', { boardId, title });
  return resp.data.data;
};

export const reorderColumns = async (boardId, columns) => {
  const resp = await api.patch('/columns/reorder', { boardId, columns });
  return resp.data;
};
