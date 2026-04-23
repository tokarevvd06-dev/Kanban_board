import { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const register = async () => {
    await api.post('/auth/register', {
      email,
      password,
      name
    });

    navigate('/login');
  };

    const login = () => {
        navigate('/login');
    }

  return (
    <div>
        <div>
            <h1>Register</h1>

            <input placeholder="name" onChange={(e) => setName(e.target.value)} />
            <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
            <input placeholder="password" type="password" onChange={(e) => setPassword(e.target.value)} />

            <button onClick={register}>Register</button>
        </div>
        <div>
            <h4>Already have an account?
                <button onClick={login}>Sign in</button>
            </h4>
        </div>
    </div>
  );
}