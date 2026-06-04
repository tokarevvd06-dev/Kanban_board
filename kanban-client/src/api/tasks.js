import api from './api';

export const createTask = async (columnId, title, description = '') => {
  const trimmedTitle = title?.trim();
  if (!columnId || !trimmedTitle) {
    throw new Error('Некорректные данные задачи');
  }

  const resp = await api.post('/tasks', {
    columnId: String(columnId),
    title: trimmedTitle,
    description,
  });
  return resp.data.data;
};

export const moveTask = async ({
  taskId,
  fromColumnId,
  toColumnId,
  newPosition,
}) => {
  const position = Number(newPosition);

  if (!taskId || !fromColumnId || !toColumnId || !Number.isFinite(position) || position < 1) {
    throw new Error('Некорректные данные перемещения');
  }

  const resp = await api.patch('/tasks/move', {
    taskId: String(taskId),
    fromColumnId: String(fromColumnId),
    toColumnId: String(toColumnId),
    newPosition: position,
  });
  return resp.data;
};
