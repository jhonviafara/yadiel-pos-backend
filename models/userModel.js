export const intentoLog = 'SELECT * FROM usuarios WHERE nombre = ? '
export const consultaJugadores = `SELECT JU.*, EST.estado , CAT.nombre AS categoria_nombre
       FROM jugadores JU 
       INNER JOIN estado_jugadores EST ON  JU.id_estado = EST.id 
       INNER JOIN categorias CAT ON  JU.id_categoria = CAT.id`;
export const consultaEntrenadores = `SELECT ENT.nombre AS entrenador_nombre, ENT.apellido AS entrenador_apellido, 
       CAT.nombre AS categoria_nombre, 
       COUNT(JU.id) AS cantidad_jugadores
FROM entrenadores ENT
INNER JOIN categorias CAT ON ENT.id_categoria = CAT.id
LEFT JOIN jugadores JU ON JU.id_categoria = CAT.id
GROUP BY ENT.id, ENT.nombre, ENT.apellido, CAT.nombre;`