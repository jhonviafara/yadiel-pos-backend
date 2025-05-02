import connection from "../config/db.js";

export const registrarVenta = (req, res) => {
  const { usuario_id, comercio_id, productos, pagos, total,fecha } = req.body;
  if (!usuario_id || !comercio_id || !Array.isArray(productos) || productos.length === 0 || pagos.length === 0) {
    return res.status(400).json({ mensaje: "Faltan datos o lista de productos vacía" });
  }

  if (typeof total !== 'number' || total <= 0) {
    return res.status(400).json({
      success: false,
      message: "Total inválido"
    });
  }

  // Inicia la transacción
  connection.run("BEGIN TRANSACTION;", function(err) {
    if (err) {
      return res.status(500).json({ mensaje: "Error al iniciar transacción" });
    }
  
    connection.run(
      `INSERT INTO ventas (usuario_id, comercio_id, total,fecha) VALUES (?, ?, ?,?)`,
      [usuario_id, comercio_id, total,fecha],
      function (error) {
        if (error) {
          console.error("Error al insertar venta:", error.message);
          return connection.run("ROLLBACK;", () => {
            return res.status(500).json({ mensaje: "Error al registrar venta" });
          });
        }

        const ventaId = this.lastID;

        const insertDetalle = connection.prepare(`
          INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario)
          VALUES (?, ?, ?, ?)
        `);

        for (const item of productos) {
          insertDetalle.run([ventaId, item.id, item.cantidad, item.precio]);
        }

        insertDetalle.finalize((err) => {
          if (err) {
            console.error("Error al insertar detalles:", err.message);
            return connection.run("ROLLBACK;", () => {
              return res.status(500).json({ mensaje: "Error al registrar detalle de venta" });
            });
          }

          // Ahora insertamos los pagos
          const insertPago = connection.prepare(`
            INSERT INTO pagos (venta_id, metodo, monto)
            VALUES (?, ?, ?)
          `);

          Promise.all(
            pagos.map((pago) =>
              new Promise((resolve, reject) => {
                const metodoCambiado = pago.metodo.toLowerCase();
                insertPago.run([ventaId, metodoCambiado, pago.monto], function (err) {
                  if (err) {
                    console.error("Error al insertar pago:", err.message);
                    reject(err);
                  } else {
                    resolve();
                  }
                });
              })
            )
          )
          .then(() => {
            insertPago.finalize((err) => {
              if (err) {
                console.error("Error al finalizar inserción de pagos:", err.message);
                return connection.run("ROLLBACK;", () =>
                  res.status(500).json({ mensaje: "Error al registrar pagos" })
                );
              }

              connection.run("COMMIT;", () => {
                return res.status(201).json({ mensaje: "Venta registrada con pagos", venta_id: ventaId });
              });
            });
          })
          .catch((err) => {
            console.error("Error en la inserción de pagos:", err.message);
            connection.run("ROLLBACK;", () => {
              res.status(500).json({ mensaje: "Error al registrar un pago" });
            });
          });
        });
      }
    );
  });
};
