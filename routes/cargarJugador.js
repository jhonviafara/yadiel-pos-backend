import { Router } from "express";
import { controllerCargarJugador } from "../controllers/controlller.new.jugador.js";
import { verifyToken } from "../middleware/verfyTokenMiddleware.js";

const cargarjugadoresRouter = Router();
cargarjugadoresRouter.post(
  "/cargar-jugador",
  verifyToken,
  controllerCargarJugador
);
export default cargarjugadoresRouter;
