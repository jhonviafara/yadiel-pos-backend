import connection from "../config/db.js";

export const registrarVenta = (req, res) => {
  const { usuario_id, comercio_id, productos, pagos, total, fecha, cambio } = req.body;

  if (!usuario_id || !comercio_id || !Array.isArray(productos) || productos.length === 0 || pagos.length === 0) {
    return res.status(400).json({ mensaje: "Faltan datos o lista de productos vacía" });
  }
  console.log(cambio);
  

  if (typeof total !== 'number' || total <= 0) {
    return res.status(400).json({
      success: false,
      message: "Total inválido"
    });
  }

  connection.run("BEGIN TRANSACTION;", function(err) {
    if (err) {
      return res.status(500).json({ mensaje: "Error al iniciar transacción" });
    }

    connection.run(
      `INSERT INTO ventas (usuario_id, comercio_id, total, fecha) VALUES (?, ?, ?, ?)`,
      [usuario_id, comercio_id, total, fecha],
      function (error) {
        if (error) {
          return connection.run("ROLLBACK;", () => {
            return res.status(500).json({ mensaje: "Error al registrar venta" });
          });
        }

        const ventaId = this.lastID;

        // Insertar detalle de productos
        const insertDetalle = connection.prepare(`
          INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario)
          VALUES (?, ?, ?, ?)
        `);

        const updateStock = connection.prepare(`
          UPDATE productos SET stock = stock - ? WHERE id = ?
        `);

        for (const item of productos) {
          insertDetalle.run([ventaId, item.id, item.cantidad, item.precio]);
          updateStock.run([item.cantidad, item.id]);
        }

        insertDetalle.finalize();
        updateStock.finalize();

        // Insertar pagos
        const insertPago = connection.prepare(`
          INSERT INTO pagos (venta_id, metodo, monto)
          VALUES (?, ?, ?)
        `);

        const insertMovimiento = connection.prepare(`
          INSERT INTO caja_movimientos (tipo, motivo, metodo_pago, monto, venta_id, usuario_id)
          VALUES (?, ?, ?, ?, ?, ?)
        `);
        console.log('DEBUG - usuario_id:', usuario_id, typeof usuario_id);
        console.log('DEBUG - ventaId:', ventaId);
        Promise.all(
          pagos.map((pago) =>
            new Promise((resolve, reject) => {
              const metodo = pago.metodo.toLowerCase();

              // Insertar pago
              insertPago.run([ventaId, metodo, pago.monto], function (err) {
                if (err) return reject(err);

                // Insertar movimiento de ingreso
                insertMovimiento.run(['ingreso', 'venta', metodo, pago.monto, ventaId,usuario_id], function (err) {
                  if (err) return reject(err);
                  console.log(`Movimiento registrado: ${metodo} - ${pago.monto} usuario: ${usuario_id}`);
                  
                  resolve();
                });
              });
            })
          )
        )
        .then(() => {
          // Registrar egreso por cambio, si lo hay
          if (cambio && cambio > 0) {
            insertMovimiento.run(['egreso', 'cambio', 'efectivo', cambio, ventaId, usuario_id ]);
          }

          insertPago.finalize();
          insertMovimiento.finalize();

          connection.run("COMMIT;", () => {
            res.status(201).json({ mensaje: "Venta registrada con pagos y caja actualizada", venta_id: ventaId });
          });
        })
        .catch((err) => {
          console.error("Error en la inserción de pagos o movimientos:", err.message);
          connection.run("ROLLBACK;", () => {
            res.status(500).json({ mensaje: "Error al registrar venta completa" });
          });
        });
      }
    );
  });
};
