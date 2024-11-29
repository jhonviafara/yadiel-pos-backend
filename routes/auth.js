import express from "express";
import { loginUsuario, registerUser } from "../controllers/authController.js";

const routerLogin = express.Router();

//loguear usuario existente
routerLogin.post("/login", loginUsuario);

// Ruta para registrar un nuevo usuario
routerLogin.post("/register", registerUser);

export default routerLogin;
