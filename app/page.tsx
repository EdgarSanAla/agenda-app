"use client"

import { useEffect, useState } from "react"

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")

  const fetchTasks = async () => {
    const res = await fetch(`/api/tasks?date=${date}`)
    const data = await res.json()
    setTasks(data)
  }

  const addTask = async () => {
    if (!title || !date) return
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, date }),
    })
    setTitle("")
    fetchTasks()
  }

  useEffect(() => {
    if (date) fetchTasks()
  }, [date])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Agenda</h1>

      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        className="border p-2 mr-2"
      />

      <input
        type="text"
        placeholder="Nueva tarea"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="border p-2 mr-2"
      />

      <button onClick={addTask} className="bg-blue-500 text-white px-4 py-2">
        Agregar
      </button>

      <ul className="mt-4">
        {tasks.map(t => (
          <li key={t.id} className="border-b py-2">
            {t.title} {t.done ? "✅" : "⏳"}
          </li>
        ))}
      </ul>
    </div>
  )
}
