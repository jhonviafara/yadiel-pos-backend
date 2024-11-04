import sqlite3 from 'sqlite3';

 const connection = new sqlite3.Database("./data.db");

connection.all("SELECT DATE() AS fecha", (error, result) => {
    if (error) {
      throw console.log(error.message);
    }
    return console.log(result[0].fecha);
  });
  
  //EXPORTARLA COMO MODULO PARA USARLA EN LOS CONTROLADORES
 
export default connection;
