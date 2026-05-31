import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Boards from './pages/Boards';
import BoardPage from './pages/BoardPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/boards" element={<Boards />} />
        <Route path="/register" element={<Register />} />
        <Route path="/board-page/:id" element={<BoardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
