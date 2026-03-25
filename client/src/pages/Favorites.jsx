import { useEffect, useState } from "react";

export default function Favorites() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/api/tasks");
    const data = await res.json();

    const favTasks = data.filter((task) => task.isFavorite);
    setTasks(favTasks);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl mb-4">⭐ Favorite Tasks</h1>

      {tasks.map((task) => (
        <div key={task._id} className="bg-gray-800 p-3 mb-2 rounded">
          {task.text}
        </div>
      ))}
    </div>
  );
}