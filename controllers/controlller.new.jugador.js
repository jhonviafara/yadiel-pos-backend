import connection from "../config/db.js";
import { insertJugador } from "../models/userModel.js";

export async function controllerCargarJugador(req, res) {
  const { nombre, apellido, edad, id_categoria, id_estado, contacto } =
    req.body;
  if (
    !nombre ||
    !apellido ||
    !edad ||
    !id_categoria ||
    !id_estado ||
    !contacto
  ) {
    return res
      .status(400)
      .json({ message: "todos los campos son obligatorios" });
  }
  connection.run(
    insertJugador,
    [nombre, apellido, edad, id_categoria, id_estado, contacto],
    (err) => {
      if (err) {
        return err.status(500).json({ error: "Error en el servidor" });
      }

      return res.status(200).json({ message: "Jugador registrado con éxito" });
    }
  );
}
