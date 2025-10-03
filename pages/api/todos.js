import { createClient } from '@supabase/supabase-js'

// 替换成你的 Supabase 信息
const supabaseUrl = 'https://oqaflsakmieuqlbgelqg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xYWZsc2FrbWlldXFsYmdlbHFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NTQwMzgsImV4cCI6MjA3NTAzMDAzOH0.v0DDNHAv8eTR2sRzO0-B38I53dHFHmNM738zvmoZPHU'

const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  const { method } = req

  // 获取所有待办事项
  if (method === 'GET') {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  // 添加新待办事项
  if (method === 'POST') {
    const { task } = req.body
    const { data, error } = await supabase
      .from('todos')
      .insert([{ task, completed: false }])
      .select()
      .single()
    
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  // 更新待办事项
  if (method === 'PUT') {
    const { id, completed } = req.body
    const { data, error } = await supabase
      .from('todos')
      .update({ completed })
      .eq('id', id)
      .select()
      .single()
    
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  // 删除待办事项
  if (method === 'DELETE') {
    const { id } = req.body
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
    
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
