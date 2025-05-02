
-- Habilitamos claves foráneas para SQLite
PRAGMA foreign_keys = ON;

-- Comercios
CREATE TABLE IF NOT EXISTS comercios (
  id          INTEGER PRIMARY KEY,
  nombre      TEXT    NOT NULL,
  direccion   TEXT
);

-- Roles
CREATE TABLE IF NOT EXISTS roles (
  id     INTEGER PRIMARY KEY,
  nombre TEXT    NOT NULL UNIQUE
);

-- Permisos del sistema
CREATE TABLE IF NOT EXISTS permisos (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT    NOT NULL UNIQUE
);

-- Relación N:N entre roles y permisos
CREATE TABLE IF NOT EXISTS rol_permiso (
  rol_id     INTEGER NOT NULL,
  permiso_id INTEGER NOT NULL,
  PRIMARY KEY (rol_id, permiso_id),
  FOREIGN KEY (rol_id)     REFERENCES roles(id)    ON DELETE CASCADE,
  FOREIGN KEY (permiso_id) REFERENCES permisos(id) ON DELETE CASCADE
);

-- Usuarios del sistema
CREATE TABLE IF NOT EXISTS usuarios (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre       TEXT    NOT NULL,
  email        TEXT    UNIQUE NOT NULL,
  password     TEXT    NOT NULL,
  rol_id       INTEGER NOT NULL,
  comercio_id  INTEGER NOT NULL,
  activo       BOOLEAN DEFAULT 1,
  creado_en    DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rol_id)      REFERENCES roles(id)     ON DELETE RESTRICT,
  FOREIGN KEY (comercio_id) REFERENCES comercios(id) ON DELETE CASCADE
);

-- Productos disponibles
CREATE TABLE IF NOT EXISTS productos (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre       TEXT    NOT NULL,
  descripcion  TEXT,
  precio       REAL    NOT NULL,
  stock        INTEGER NOT NULL DEFAULT 0,
  activo       BOOLEAN DEFAULT 1,
  comercio_id  INTEGER NOT NULL,
  FOREIGN KEY (comercio_id) REFERENCES comercios(id) ON DELETE CASCADE
);

-- Ventas realizadas
CREATE TABLE IF NOT EXISTS ventas (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id   INTEGER NOT NULL,
  comercio_id  INTEGER NOT NULL,
  total        REAL    NOT NULL,
  fecha        DATETIME ,
  anulada      BOOLEAN DEFAULT 0,
  FOREIGN KEY (usuario_id)   REFERENCES usuarios(id)   ON DELETE CASCADE,
  FOREIGN KEY (comercio_id)  REFERENCES comercios(id)  ON DELETE CASCADE
);

-- Detalle de productos vendidos
CREATE TABLE IF NOT EXISTS detalle_venta (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  venta_id        INTEGER NOT NULL,
  producto_id     INTEGER NOT NULL,
  cantidad        INTEGER NOT NULL,
  precio_unitario REAL    NOT NULL,
  subtotal        REAL GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
  FOREIGN KEY (venta_id)    REFERENCES ventas(id)     ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Métodos de pago por venta
CREATE TABLE IF NOT EXISTS pagos (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  venta_id   INTEGER NOT NULL,
  metodo     TEXT    NOT NULL CHECK (metodo IN ('efectivo','tarjeta','transferencia','mp','otro')),
  monto      REAL    NOT NULL,
  FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE
);

-- Anulaciones (autorizadas por admins)
CREATE TABLE IF NOT EXISTS anulaciones (
  id                   INTEGER PRIMARY KEY AUTOINCREMENT,
  venta_id             INTEGER NOT NULL,
  usuario_id           INTEGER NOT NULL,
  codigo_autorizacion  TEXT    NOT NULL,
  motivo               TEXT,
  fecha                DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (venta_id)   REFERENCES ventas(id)   ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Historial de sesiones (seguridad)
CREATE TABLE IF NOT EXISTS sesiones (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id  INTEGER NOT NULL,
  token       TEXT    NOT NULL,
  creado_en   DATETIME DEFAULT CURRENT_TIMESTAMP,
  expiracion  DATETIME,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Auditoría de acciones (control total)
CREATE TABLE IF NOT EXISTS auditoria (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id   INTEGER,
  accion       TEXT    NOT NULL,
  tabla        TEXT,
  registro_id  INTEGER,
  fecha        DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
