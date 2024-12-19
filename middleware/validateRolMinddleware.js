import { log } from "console";
import dotenv, { config } from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config()


export const validateRol = (req,res,next)=>{
const token = req.headers["authorization"] //obtengo el token de el post que hace el cliente
    if (!token) {
        return res.status(403).json({ message: "Token requerido" });
      }
      try {
        const decoded = jwt.verify(token.split(" "[1]),process.env.SECRET_KEY)
      if (decoded.rol !== 6323) {
            return  res.status(403).json({message:"rol no  autorizado para acceder"})
        } 
        req.user = decoded;
        next();
      } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
        
      }

}