import { useState } from 'react';
import api from '../api/api';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import styles from './styles/Auth.module.scss';
export default function Register() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  const register = async () => {
    if (password !== confirmPassword) {
      return;
    }

    const res = await api.post('/auth/register', {
      email,
      password,
      name,
    });
    setAuth(res.data.data);
    navigate('/boards');
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Регистрация</h1>

        <div className={styles.form}>
          <input
            className={styles.input}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />

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

          <input
            type="password"
            className={styles.input}
            placeholder="Confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {confirmPassword && password !== confirmPassword && (
            <p className={styles.error}>Passwords don’t match</p>
          )}

          <button onClick={register} className={styles.submitButton}>
            Register
          </button>
        </div>

        <div className={styles.footer}>
          Already have an account?{' '}
          <a href="/" className={styles.link}>
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
