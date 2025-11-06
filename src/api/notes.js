import api from './api';

// Create a note
export const createNote = async ({ title, content }) => {
  try {
    const res = await api.post('/notes/createNote', { title, content });
    return res.data;
  } catch (err) {
    // Some backends expect alternate keys – fall back seamlessly
    const status = err?.response?.status;
    if (status === 400 || status === 422) {
      try {
        const res2 = await api.post('/notes/createNote', { noteTitle: title, noteContent: content });
        return res2.data;
      } catch (err2) {
        throw err2;
      }
    }
    throw err;
  }
};

// Delete a note by id
export const deleteNote = async (id) => {
  const res = await api.delete('/notes/deleteNote', { params: { id } });
  return res.data;
};

// Get all notes (supports query params)
export const getAllNotes = async (query = {}) => {
  const res = await api.get('/notes/getAllNotes', { params: query });
  return res.data;
};

// Update a note (either title, content, or both)
export const updateNote = async (id, { title, content }) => {
  const payload = { id };
  if (typeof title !== 'undefined') payload.title = title;
  if (typeof content !== 'undefined') payload.content = content;
  const res = await api.patch('/notes/updateNote', payload);
  return res.data;
};

// Get a single note by id
export const getNoteById = async (id) => {
  const res = await api.get('/notes/getNoteById', { params: { id } });
  return res.data;
};

export default { createNote, deleteNote, getAllNotes, updateNote, getNoteById };


