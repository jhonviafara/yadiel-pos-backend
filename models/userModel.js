export const insertJugador = `INSERT INTO jugadores (nombre,apellido,edad,id_categoria,id_estado,contacto) VALUES(?,?,?,?,?,?)`;
export const createUserQuery =
  "INSERT INTO usuarios (nombre, email,password,rol_id,comercio_id) VALUES (?, ?, ?, ?,?)";
export const intentoLog =`SELECT u.id, u.nombre, u.password, u.rol_id, u.comercio_id 
FROM usuarios u 
WHERE u.nombre = ?`;
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
GROUP BY ENT.id, ENT.nombre, ENT.apellido, CAT.nombre;`;
export const consultaCategoria = `SELECT CAT.id AS categoria_id, CAT.nombre AS categoria_nombre, COUNT(JU.id) AS cantidad_jugadores
FROM categorias CAT
LEFT JOIN jugadores JU ON JU.id_categoria = CAT.id
GROUP BY CAT.id, CAT.nombre`;

export const HISTORIAL_VENTAS_QUERY = `
  SELECT 
    v.id,
    u.nombre AS cliente,
    v.fecha,
    GROUP_CONCAT(p.nombre, ', ') AS productos,
    (
      SELECT SUM(dv2.subtotal)
      FROM detalle_venta dv2
      WHERE dv2.venta_id = v.id
    ) AS total_venta,
    GROUP_CONCAT(pg.metodo || ' $' || pg.monto, ' + ') AS metodo_pago
  FROM ventas v
  JOIN usuarios u ON v.usuario_id = u.id
  JOIN detalle_venta dv ON dv.venta_id = v.id
  JOIN productos p ON p.id = dv.producto_id
  LEFT JOIN pagos pg ON pg.venta_id = v.id
  WHERE v.anulada = 0
  GROUP BY v.id
  ORDER BY v.fecha DESC
`;