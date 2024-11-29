export const verifyRole = (rolesPermitidos) => {
  return (req, res, next) => {
    const { rol } = req.user; // Suponiendo que `req.user` es generado por JWT

    if (!rolesPermitidos.includes(rol)) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para realizar esta acción" });
    }
    next();
  };
};
