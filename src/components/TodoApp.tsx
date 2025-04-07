import React, { useState, useEffect } from 'react';
import '../assets/TodoApp.css'; // นำเข้าฟайл CSS ของเรา

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos]);

  const handleAdd = () => {
    if (!input.trim()) return;

    if (editId !== null) {
      setTodos(prev =>
        prev.map(todo =>
          todo.id === editId ? { ...todo, text: input } : todo
        )
      );
      setEditId(null);
    } else {
      setTodos(prev => [
        ...prev,
        { id: Date.now(), text: input, completed: false },
      ]);
    }
    setInput('');
  };

  const handleDelete = (id: number) => {
    setTodos(prev => {
      const updatedTodos = prev.filter(todo => todo.id !== id);
      if (updatedTodos.length === 0) {
        localStorage.removeItem('todos');
      } else {
        localStorage.setItem('todos', JSON.stringify(updatedTodos));
      }
      return updatedTodos;
    });
  };

  const handleEdit = (todo: Todo) => {
    setInput(todo.text);
    setEditId(todo.id);
  };

  const toggleComplete = (id: number) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">📝 Todo List</h2>
      <div className="d-flex mb-4">
        <input
          className="form-control me-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="ใส่งานที่ต้องทำ"
        />
        <button className="btn btn-primary" onClick={handleAdd}>
          {editId !== null ? 'อัปเดต' : 'เพิ่ม'}
        </button>
      </div>

      <ul className="list-group">
        {todos.map(todo => (
          <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo.id)}
                className="form-check-input me-2"
              />
              <span
                style={{ textDecoration: todo.completed ? 'line-through' : '' }}
                className="flex-grow-1"
              >
                {todo.text}
              </span>
            </div>
            <div>
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => handleEdit(todo)}
              >
                ✏️
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(todo.id)}
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
