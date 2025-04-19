import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');

  // 讀取待辦事項
  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('讀取失敗:', error);
    } else {
      setTodos(data);
    }
  };

  // 新增任務
  const addTodo = async () => {
    if (newTitle.trim() === '') return;

    const { error } = await supabase.from('todos').insert([
      {
        title: newTitle,
        is_complete: false,
      },
    ]);

    if (error) {
      console.error('新增失敗:', error);
    } else {
      setNewTitle('');
      fetchTodos();
    }
  };

  // 勾選/取消勾選任務
  const toggleComplete = async (id, currentStatus) => {
    const { error } = await supabase
      .from('todos')
      .update({ is_complete: !currentStatus })
      .eq('id', id);

    if (error) {
      console.error('更新失敗:', error);
    } else {
      fetchTodos();
    }
  };

  // 刪除任務
  const deleteTodo = async (id) => {
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (error) {
      console.error('刪除失敗:', error);
    } else {
      fetchTodos();
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: 'sans-serif',
    }}>
      <h1 style={{ textAlign: 'center' }}>📝 我的待辦清單</h1>
  
      {/* 輸入區 */}
      <div style={{ display: 'flex', marginBottom: '1.5rem' }}>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="輸入新的任務"
          style={{
            flex: 1,
            padding: '10px',
            fontSize: '16px',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        />
        <button
          onClick={addTodo}
          style={{
            marginLeft: '10px',
            padding: '10px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          ➕ 新增任務
        </button>
      </div>
  
      {/* 清單區 */}
      {todos.length === 0 ? (
        <p style={{ textAlign: 'center' }}>目前尚無待辦事項。</p>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {todos.map((todo) => (
            <div
              key={todo.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px',
                border: '1px solid #ddd',
                borderRadius: '10px',
                backgroundColor: '#f9f9f9',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              }}
            >
              <label style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={todo.is_complete}
                  onChange={() => toggleComplete(todo.id, todo.is_complete)}
                />
                <span style={{
                  marginLeft: '12px',
                  fontSize: '16px',
                  textDecoration: todo.is_complete ? 'line-through' : 'none',
                  color: todo.is_complete ? '#999' : '#333',
                }}>
                  {todo.title}
                </span>
              </label>
  
              <button
                onClick={() => deleteTodo(todo.id)}
                style={{
                  backgroundColor: '#ff4d4f',
                  border: 'none',
                  color: 'white',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  

}
export default App;
