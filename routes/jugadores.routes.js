import { Router } from "express";
import { controllerJugador } from "../controllers/jugador.controller.js";
import { verifyToken } from "../middleware/verfyTokenMiddleware.js";

const jugadoresRouter = Router();
jugadoresRouter.get("/planilla-jugadores", verifyToken, controllerJugador);
export default jugadoresRouter;
