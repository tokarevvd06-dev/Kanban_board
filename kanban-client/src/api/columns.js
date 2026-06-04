import api from './api';

export const createColumn = async (boardId, title) => {
  const trimmedTitle = title?.trim();
  if (!boardId || !trimmedTitle) {
    throw new Error('Некорректные данные колонки');
  }

  const resp = await api.post('/columns', {
    boardId: String(boardId),
    title: trimmedTitle,
  });
  return resp.data.data;
};

export const reorderColumns = async (boardId, columns) => {
  if (!boardId) {
    throw new Error('Некорректный id доски');
  }

  const resp = await api.patch('/columns/reorder', {
    boardId: String(boardId),
    columns,
  });
  return resp.data;
};
