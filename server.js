import dotenv, { config } from "dotenv";
import express from "express";
import cors from "cors";
import jugadoresRouter from "./routes/jugadores.routes.js";
import entrenadoresRouter from "./routes/entrenadores.routes.js";
import routerLogin from "./routes/auth.js";
import categoriaRouter from "./routes/categoria.routes.js";
import cargarjugadoresRouter from "./routes/cargarJugador.js";

const app = express();
dotenv.config();

// variables de entorno desde .env
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
// Rutas de logueo
app.use("/auth", routerLogin);
app.use("/", jugadoresRouter);
app.use("/", cargarjugadoresRouter); //crear rutas para actualizar los datos
app.use("/", entrenadoresRouter);
app.use("/", categoriaRouter);

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
