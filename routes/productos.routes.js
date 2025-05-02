import express from "express";
import db from "../config/db.js"; // Importa la conexión a la base de datos

const productosRouter = express.Router();
productosRouter.get("/", async (req, res) => {
  try {

    const nombre = req.query.nombre; // Obtiene el nombre del producto de la consulta
    const query = "SELECT * FROM productos"; // Consulta para obtener productos
    db.all(query, [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows); // Devuelve los productos en formato JSON
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default productosRouter;
