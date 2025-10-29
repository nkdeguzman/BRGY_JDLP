import axios from 'axios';

const API_URL = 'http://localhost:4000/api/notes'; // adjust if needed

export const getNotes = () => axios.get(API_URL);
export const addNote = (note) => axios.post(API_URL, note);
export const updateNote = (id, note) => axios.put(`${API_URL}/${id}`, note);
export const deleteNote = (id) => axios.delete(`${API_URL}/${id}`);
