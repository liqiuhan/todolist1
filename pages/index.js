import { useState, useEffect } from 'react'

export default function Home() {
  const [todos, setTodos] = useState([])
  const [newTask, setNewTask] = useState('')
  const [loading, setLoading] = useState(true)

  // 获取所有待办事项
  useEffect(() => {
    fetchTodos()
  }, [])

  async function fetchTodos() {
    try {
      const res = await fetch('/api/todos')
      const data = await res.json()
      setTodos(data)
      setLoading(false)
    } catch (error) {
      console.error('获取失败:', error)
      setLoading(false)
    }
  }

  // 添加新任务
  async function addTodo() {
    if (!newTask.trim()) return
    
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: newTask })
      })
      const data = await res.json()
      setTodos([...todos, data])
      setNewTask('')
    } catch (error) {
      console.error('添加失败:', error)
    }
  }

  // 切换完成状态
  async function toggleTodo(id, completed) {
    try {
      const res = await fetch('/api/todos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, completed: !completed })
      })
      const data = await res.json()
      setTodos(todos.map(todo => todo.id === id ? data : todo))
    } catch (error) {
      console.error('更新失败:', error)
    }
  }

  // 删除任务
  async function deleteTodo(id) {
    try {
      await fetch('/api/todos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      setTodos(todos.filter(todo => todo.id !== id))
    } catch (error) {
      console.error('删除失败:', error)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <h1>📝 我的待办清单</h1>
        <p>加载中...</p>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>📝 我的待办清单</h1>
      
      <div className="input-group">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="输入新任务..."
          className="input"
        />
        <button onClick={addTodo} className="btn-add">添加</button>
      </div>

      <div className="todo-list">
        {todos.length === 0 ? (
          <p className="empty">暂无待办事项，添加一个吧！</p>
        ) : (
          todos.map(todo => (
            <div key={todo.id} className="todo-item">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id, todo.completed)}
              />
              <span className={todo.completed ? 'completed' : ''}>
                {todo.task}
              </span>
              <button onClick={() => deleteTodo(todo.id)} className="btn-delete">
                删除
              </button>
            </div>
          ))
        )}
      </div>

      <div className="stats">
        共 {todos.length} 项任务，已完成 {todos.filter(t => t.completed).length} 项
      </div>
    </div>
  )
}
