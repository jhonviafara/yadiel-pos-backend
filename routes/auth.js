import express from 'express';
import {registerUser,loginUsuario} from '../controllers/authController.js';

const router = express.Router();
 
//loguear usuario existente
router.post('/login', loginUsuario);
// Ruta para registrar un nuevo usuario
router.post('/register', registerUser);

export default router;