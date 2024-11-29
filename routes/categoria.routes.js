import { Router } from "express";
import { controllerCategoria } from "../controllers/categoria.controller.js";
import { verifyToken } from "../middleware/verfyTokenMiddleware.js";

const categoriaRouter = Router();
categoriaRouter.get("/planilla-categorias", verifyToken, controllerCategoria);
export default categoriaRouter;
