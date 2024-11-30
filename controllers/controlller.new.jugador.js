import connection from "../config/db.js";
import { insertJugador } from "../models/userModel.js";

export async function controllerCargarJugador(req, res) {
  connection.run(insertJugador, (err, res) => {
    if (err) {
      return res.status(500).json({ error: "Error en el servidor" });
    }

    return res.status(200).json({ mesage: "jugadores registrado con exito" });
  });
}
