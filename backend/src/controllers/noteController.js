import pool from '../config/db.js'

// Get all notes
export const getNotes = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM notes ORDER BY created_at DESC')
    res.status(200).json({ success: true, data: rows })
  } catch (error) {
    console.error('Error fetching notes:', error)
    res.status(500).json({ success: false, message: 'Error fetching notes' })
  }
}

// Add new note
export const addNote = async (req, res) => {
  try {
    const { title, content } = req.body
    await pool.execute('INSERT INTO notes (title, content) VALUES (?, ?)', [title, content])
    res.status(201).json({ success: true, message: 'Note added successfully' })
  } catch (error) {
    console.error('Error adding note:', error)
    res.status(500).json({ success: false, message: 'Error adding note' })
  }
}

// Update note
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params
    const { title, content } = req.body
    await pool.execute('UPDATE notes SET title = ?, content = ? WHERE id = ?', [title, content, id])
    res.status(200).json({ success: true, message: 'Note updated successfully' })
  } catch (error) {
    console.error('Error updating note:', error)
    res.status(500).json({ success: false, message: 'Error updating note' })
  }
}

// Delete note
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params
    await pool.execute('DELETE FROM notes WHERE id = ?', [id])
    res.status(200).json({ success: true, message: 'Note deleted successfully' })
  } catch (error) {
    console.error('Error deleting note:', error)
    res.status(500).json({ success: false, message: 'Error deleting note' })
  }
}
