import { Router } from "express";
import { controllerCategoria } from "../controllers/categoria.controller.js";
 
 const categoriaRouter = Router();
categoriaRouter.get("/planilla-categorias",controllerCategoria);
export default categoriaRouter;