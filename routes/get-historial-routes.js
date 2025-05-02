import express from 'express';
import { getHistorialVentas } from '../controllers/historial-ventas.controller.js';

const routerHistorial = express.Router();

// GET /historial-ventas/
routerHistorial.get("/", getHistorialVentas);

export default routerHistorial;
