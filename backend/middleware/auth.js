import jwt from 'jsonwebtoken';
import roles from '../data/roles.json';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_seguro_temporal';

export const verifyToken = (req, res, next) => {
  const token = req.headers['x-auth-token'] || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

export const checkRole = (requiredPermissions) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    
    // Administradores tienen acceso total
    if (userRole === 'admin') {
      return next();
    }

    // Verificar si el rol existe
    if (!roles[userRole]) {
      return res.status(403).json({ message: 'Rol no válido' });
    }

    // Verificar permisos específicos
    const userPermissions = roles[userRole].permissions;
    const hasPermission = requiredPermissions.every(
      permission => userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({ 
        message: 'No tienes permisos suficientes para esta acción' 
      });
    }

    next();
  };
}; 