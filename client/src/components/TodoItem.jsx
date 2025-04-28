
function TodoItem({ task }) {

  return (
    <div className="flex items-center justify-between border-t py-2 bg-gray-50">
      <span
        className={`text-gray-800`}
        style={{ cursor: 'pointer' }}
      >
        {task.text}
      </span>
    </div>
  );
}

export default TodoItem;