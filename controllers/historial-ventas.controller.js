import db from "../config/db.js"; // o como se llame tu archivo de conexión
import { HISTORIAL_VENTAS_QUERY } from "../models/userModel.js";

export function getHistorialVentas(req, res) {
  const query = HISTORIAL_VENTAS_QUERY

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error al obtener historial de ventas:", err.message);
      return res.status(500).json({ error: "Error al obtener ventas" });
    }
    const formateadas = rows.map(rows =>{
        const [fecha ,hora] = rows.fecha.split(" ");
        return { ...rows, fecha, hora };    
    });

    res.json(formateadas); // esto envía los datos al frontend en formato JSON
  });
}
