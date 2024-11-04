import connection from "../config/db.js";
import { consultaEntrenadores } from "../models/userModel.js";


export  async   function controllerEntrenadores (req,res)  {
    connection.all(consultaEntrenadores
         ,(err, rows)=> {
       if (err) {
           return res.status(500).json({ error: 'Error en el servidor' });
           
       } 
         console.log(rows);
         
       return res.status(200).json(rows)

    }  );
}