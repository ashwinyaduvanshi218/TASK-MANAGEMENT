import { useEffect, useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("");
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [darkMode, setDarkMode] = useState(false);

  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/api/tasks");
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!text || !priority) return alert("Fill all fields");

    await fetch("http://localhost:5000/api/tasks/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, priority }),
    });

    setText("");
    setPriority("");
    fetchTasks();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
    });

    fetchTasks();
  };

  const toggleComplete = async (task) => {
    if (!window.confirm("Mark as completed?")) return;

    await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isCompleted: !task.isCompleted }),
    });

    fetchTasks();
  };

  const toggleFavorite = async (task) => {
    await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFavorite: !task.isFavorite }),
    });

    fetchTasks();
  };

  const handleEdit = async (task) => {
    const newText = prompt("Edit task", task.text);
    if (!newText) return;

    await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText }),
    });

    fetchTasks();
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center px-3 sm:px-6 py-6 transition ${
        darkMode
          ? "bg-black text-white"
          : "bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500"
      }`}
    >
      {/* DARK MODE */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="mb-4 px-4 py-2 rounded-full bg-black text-white text-sm sm:text-base"
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>

      <h1 className="text-xl sm:text-3xl font-bold mb-4 text-white">
        🚀 Task Manager
      </h1>

      {/* FORM */}
      <div className="bg-white/20 backdrop-blur-lg p-4 sm:p-6 rounded-2xl w-full max-w-md mb-4">
        <input
          className="w-full p-2 mb-2 rounded-lg text-sm sm:text-base"
          placeholder="Enter task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <select
          className="w-full p-2 mb-2 rounded-lg text-sm sm:text-base"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="">Priority</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <button
          onClick={handleAddTask}
          className="w-full bg-indigo-600 text-white p-2 rounded-lg text-sm sm:text-base"
        >
          Add Task
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="w-full max-w-md flex flex-col sm:flex-row gap-2 mb-4">
        <input
          className="flex-1 p-2 rounded-lg text-sm"
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-2 rounded-lg text-sm"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      {/* TASK LIST */}
      <div className="w-full max-w-md space-y-3">
        {tasks
          .filter((t) =>
            t.text.toLowerCase().includes(search.toLowerCase())
          )
          .filter((t) =>
            filter === "All" ? true : t.priority === filter
          )
          .map((task) => (
            <div
              key={task._id}
              className={`p-3 sm:p-4 rounded-xl flex justify-between items-center ${
                task.isCompleted
                  ? "bg-green-400/60"
                  : darkMode
                  ? "bg-gray-800/60"
                  : "bg-white/30"
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.isCompleted}
                  onChange={() => toggleComplete(task)}
                />

                <span className="text-sm sm:text-base">
                  {task.text}
                </span>
              </div>

              <div className="flex gap-2 text-sm sm:text-base">
                <button onClick={() => toggleFavorite(task)}>
                  {task.isFavorite ? "⭐" : "☆"}
                </button>

                <button onClick={() => handleEdit(task)}>✏️</button>

                <button onClick={() => handleDelete(task._id)}>❌</button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;