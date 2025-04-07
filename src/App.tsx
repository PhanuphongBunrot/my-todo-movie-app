
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TodoPage from './page/TodoApp';
import MoviePage from './page/Search';
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<TodoPage />} />
        <Route path="/movie" element={<MoviePage />} />
      </Routes>
    </Router>
  );
}

export default App;
