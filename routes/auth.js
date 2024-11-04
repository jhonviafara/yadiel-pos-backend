import express from 'express';
import connection from '../config/db.js'; 
import  {intentoLog}  from '../models/userModel.js';

const routerLogin = express.Router();
 
//loguear usuario existente
routerLogin.post('/login', (req, res) => {
     
    const { nombre, password } = req.body;

    // Consulta a la base de datos

        
    connection.all(intentoLog, [nombre], (err, results) => {
        if (err) { 
              return res.status(500).json({ error: 'Error en lel servidor' });              
        }
         if (results.length > 0){
            const user = results[0];            
             if (user.password === password) {
                 res.status(200).json({ success: true, message: 'Login exitoso' });
                } else {
                res.status(401).json({ success: false, message: 'Credenciales incorrectas ' });
            }
        } else {            
            res.status(401).json({ success: false, message: 'Credenciales incorrectas ' });
        }
    });
});




// Ruta para registrar un nuevo usuario
routerLogin.post('/register', async (req, res) => {
    const { nombre, password } = req.body;

    try {

        // Insertar el nuevo usuario en la base de datos
        const query = 'INSERT INTO usuarios (nombre, password) VALUES (?, ?)';
        connection.run(query, [nombre,], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error en el servidor' });
            }

            res.status(201).json({ success: true, message: 'Usuario registrado con éxito' });
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

export default routerLogin;