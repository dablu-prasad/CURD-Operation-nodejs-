import express from 'express'
import { changeUserPassword, registerUser, sendUserPasswordResetEmail, userdetail, userLogin, userlogout, userPasswordReset } from '../controllers/userController.js';
import { auth } from '../middlewares/auth.js';

const userrouter = express.Router();

userrouter.post('/register', registerUser);
userrouter.get('/userdetail/:id',auth, userdetail);
userrouter.post('/login', userLogin);
userrouter.post('/logout', userlogout);
userrouter.post('/sendresetpassword', sendUserPasswordResetEmail);
userrouter.post('/resetpassword/:id/:token', userPasswordReset);
userrouter.post('/changepassword', auth, changeUserPassword);
export default userrouter;