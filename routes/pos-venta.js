import express from "express";
import { registrarVenta } from "../controllers/ventas.controller.js";

const Ventarouter = express.Router();

Ventarouter.post("/", registrarVenta);

export default Ventarouter;
