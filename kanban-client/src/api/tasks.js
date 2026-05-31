import api from './api';

export const createTask = async (columnId, title, description = '') => {
  const resp = await api.post('/tasks', { columnId, title, description });
  return resp.data.data;
};

export const moveTask = async ({
  taskId,
  fromColumnId,
  toColumnId,
  newPosition,
}) => {
  const resp = await api.patch('/tasks/move', {
    taskId,
    fromColumnId,
    toColumnId,
    newPosition,
  });
  return resp.data;
};
