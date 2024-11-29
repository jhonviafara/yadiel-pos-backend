import dotenv, { config } from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]; //traigo el token que viene con la peticion el get del cliente

  if (!token) {
    return res.status(403).json({ message: "Token requerido" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.SECRET_KEY); //el metodo verify realiza la validacion e valida el token usando el motodo plit para eliminar el prefijo que es lo que viene antes separandolo por la , como delimitador y tomamos la posision 1 (2) del array asi tenemos el token
    req.user = decoded; // contiene la información decodificada del token.
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};
