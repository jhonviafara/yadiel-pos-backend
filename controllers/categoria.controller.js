import connection from "../config/db.js";//coneccion  a la base de datos
import { consultaCategoria } from "../models/userModel.js";// contiene las query a la base de datos

export  async function controllerCategoria(req,res){
    connection.all(consultaCategoria,(err,row)=>{
            if (err) {
                 return res.status(500).json({error:"error en el servidor..."})
            }
            return res.status(200).json(row)

    }
   
)
}