import { useState } from 'react';
import api from '../api/api';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import styles from './styles/Auth.module.scss';

export default function Login() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    const res = await api.post('/auth/login', {
      email,
      password,
    });

    setAuth(res.data.data);
    navigate('/boards');
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Вход</h1>

        <div className={styles.form}>
          <input
            className={styles.input}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className={styles.input}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={login} className={styles.submitButton}>
            Login
          </button>
        </div>

        <div className={styles.footer}>
          Don’t have an account?{' '}
          <a href="/register" className={styles.link}>
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
