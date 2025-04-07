import React from 'react';
import TodoApp from './components/TodoApp';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <TodoApp />
    </div>
  );
};

export default App;
