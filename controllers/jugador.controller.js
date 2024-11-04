import connection from "../config/db.js";
import { consultaJugadores } from "../models/userModel.js";


export  async   function controllerJugador (req,res)  {
    connection.all(consultaJugadores
         ,(err, rows)=> {
       if (err) {
           return res.status(500).json({ error: 'Error en el servidor' });
           
       } 
         
       return res.status(200).json(rows)

    }  );
}