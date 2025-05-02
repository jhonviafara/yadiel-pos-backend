import dotenv, { config } from "dotenv";
import express from "express";
import cors from "cors";
import routerLogin from "./routes/auth.js";
import routerHistorial from "./routes/get-historial-routes.js";
import productosRouter from "./routes/productos.routes.js";
import Ventarouter from "./routes/pos-venta.js";

const app = express();
dotenv.config();

// variables de entorno desde .env
const PORT = process.env.PORT||3001;

app.use(cors());
app.use(express.json());
// Rutas de logueo
app.use("/auth", routerLogin);
app.use("/historial-ventas",routerHistorial );
//app.use("/iniciar-ventas",registrarVenta );
app.use("/ventas", Ventarouter);
app.use("/productos", productosRouter);

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
