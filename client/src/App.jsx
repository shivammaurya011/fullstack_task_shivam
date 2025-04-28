import { useState } from 'react';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import useSocket from './hooks/useSocket';
import notAppIcon from './assets/notes-app-icon.svg';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useSocket(setTasks, setIsLoading, setError);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md border rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-2">
          <img src={notAppIcon} alt="Notes App" className="h-16 w-16" />
          <h1 className="text-4xl font-bold">Note App</h1>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {isLoading ? (
          <p className="text-gray-500">Loading tasks...</p>
        ) : (
          <>
            <TodoInput />
            <TodoList tasks={tasks} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;