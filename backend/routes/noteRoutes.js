import express from 'express'
import { deleteNotes, getuserNotes, getuserNotesbyid, updateNotes, userNotes } from '../controllers/notesController.js';
import { auth } from '../middlewares/auth.js';

const noterouter = express.Router();

noterouter.post('/usernotes',auth, userNotes);
noterouter.get('/getnotes',auth, getuserNotes);
noterouter.get('/getnotes/:id',auth, getuserNotesbyid);
noterouter.put('/updatenotes/:id',auth, updateNotes);
noterouter.delete('/deletenotes/:id',auth, deleteNotes);

export default noterouter;