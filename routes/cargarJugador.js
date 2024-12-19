import { Router } from "express";
import { controllerCargarJugador } from "../controllers/controlller.new.jugador.js";
import { verifyToken } from "../middleware/verfyTokenMiddleware.js";
import { validateRol } from "../middleware/validateRolMinddleware.js";

const cargarjugadoresRouter = Router();

cargarjugadoresRouter.post(
  "/cargar-jugador",
  verifyToken,validateRol(6323),
  controllerCargarJugador
);
export default cargarjugadoresRouter;
