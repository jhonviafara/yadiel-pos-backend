
export const createUserQuery =
  "INSERT INTO usuarios (nombre, email,password,rol_id,comercio_id) VALUES (?, ?, ?, ?,?)";
export const intentoLog =`SELECT u.id, u.nombre, u.password, u.rol_id, u.comercio_id 
FROM usuarios u 
WHERE u.nombre = ?`;
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
      (
      SELECT GROUP_CONCAT(metodo || ' $' || total)
      FROM (
        SELECT metodo, SUM(monto) AS total
        FROM pagos
        WHERE venta_id = v.id
        GROUP BY metodo
      )
    ) AS metodo_pago

  FROM ventas v
  JOIN usuarios u ON v.usuario_id = u.id
  JOIN detalle_venta dv ON dv.venta_id = v.id
  JOIN productos p ON p.id = dv.producto_id
  LEFT JOIN pagos pg ON pg.venta_id = v.id
  WHERE v.anulada = 0
  GROUP BY v.id
  ORDER BY v.fecha DESC
`;