import { Router } from "express";
import { controllerEntrenadores } from "../controllers/entrenadores.controller.js";
 
 const entrenadoresRouter = Router();
entrenadoresRouter.get("/planilla-entrenadores",controllerEntrenadores);
export default entrenadoresRouter;