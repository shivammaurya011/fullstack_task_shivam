import { useState } from 'react';
import { io } from 'socket.io-client';
import plusIcon from '../assets/plus-circle-icon.svg';

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  cors: { origin: import.meta.env.VITE_CORS_ORIGIN },
});

function TodoInput() {
  const [task, setTask] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim()) {
      socket.emit('add', task);
      setTask('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a new task"
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#92400E]"
        />
        <button
          type="submit"
          className="px-4 py-2 flex gap-2 bg-[#92400E] text-white rounded-lg hover:bg-[#924011]"
        >
          <img src={plusIcon} alt="Add Task" className="w-6 h-6" />
          <span className="text-xl font-semibold">Add</span>
        </button>
      </div>
    </form>
  );
}

export default TodoInput;