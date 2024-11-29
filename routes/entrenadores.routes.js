import { Router } from "express";
import { controllerEntrenadores } from "../controllers/entrenadores.controller.js";
import { verifyToken } from "../middleware/verfyTokenMiddleware.js";

const entrenadoresRouter = Router();
entrenadoresRouter.get(
  "/planilla-entrenadores",
  verifyToken,
  controllerEntrenadores
);
export default entrenadoresRouter;
