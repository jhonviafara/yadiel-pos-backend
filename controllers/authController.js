import bcrypt from "bcrypt";
import connection from "../config/db.js";
import { createUserQuery, intentoLog } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//registrar un usuario
export const registerUser = async (req, res) => {
  const { nombre, email, password, rol ,comercioId } = req.body;
  if (!nombre || !email || !password || !rol || !comercioId) {
    return res
      .status(400)
      .json({ error: " todos los campos son obligatorios" });
  }
  try {
    //hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    connection.run(
      createUserQuery,
      [nombre,email,hashedPassword, rol, comercioId],
      (err) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "error en el registro de usuario" });
        }
        res.status(201).json({ message: "Usuario registrado con éxito" });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
};

//logear un usuario existente
export const loginUsuario = async (req, res) => {
  const { nombre, password } = req.body;

  connection.all(intentoLog, [nombre], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Error al buscar usuario" });
    }
    let usuario = row[0];
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    } else {
      const match = bcrypt.compareSync(password, usuario.password);
      if (match ) {        
        const rolUser = usuario.rol_id; // saco el rol de usuario luego que este paso el proseso de validacin de usuario
       const token = jwt.sign(
          //generando el token con el metodo sing
          {  rol: usuario.rol_id ,id:usuario.id,comercio:usuario.comercio_id},
          process.env.SECRET_KEY,
          {
            expiresIn: process.env.JWT_EXPIRATION || "1h",
            algorithm: "HS256", //tipo de algoritmo usado para cifrar
          }
        );
        return res.status(200).json({
          token,
          rol: rolUser,
          id: usuario.id , // envio el id de usuario
          idcomercio: usuario.comercio_id, // envio en las res el rol de usuario
          message: "Inicio de sesión exitoso",
        });
      } else {
        return res.status(401).json({ message: "Contraseña invalida" });
      }
    }
  });
};
