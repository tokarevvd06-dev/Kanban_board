import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,

  setAuth: (data) => {
    localStorage.setItem('token', data.token);

    set({
      user: data.user,
      token: data.token
    });
  },

  logout: () => {
    localStorage.removeItem('token');

    set({
      user: null,
      token: null
    });
  }
}));