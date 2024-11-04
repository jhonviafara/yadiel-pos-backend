import { Router } from "express";
import { controllerJugador } from "../controllers/jugador.controller.js";
 
 const jugadoresRouter = Router();
jugadoresRouter.get("/planilla-jugadores",controllerJugador);
export default jugadoresRouter;

