import TodoItem from './TodoItem';

function TodoList({ tasks }) {
  return (
    <div className="space-y-2">
      <h1 className="font-semibold">Notes</h1>
      <div
        className="max-h-80 overflow-y-auto"
        style={{ scrollbarWidth: 'thin' }}
      >
        {tasks.length === 0 ? (
          <p className="text-gray-500 p-2">No tasks available</p>
        ) : (
          [...tasks].reverse().map((task) => <TodoItem key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}

export default TodoList;