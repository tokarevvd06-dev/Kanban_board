import api from './api';

export const postNewBoard = async (title) => {
  const data = await api.post('/boards', { title });
  return data.data;
};
