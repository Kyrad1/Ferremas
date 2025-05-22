import jwt from 'jsonwebtoken';
import users from '../data/users.json';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_seguro_temporal';

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Buscar usuario
    const user = users.users.find(u => u.username === username);
    
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // En un ambiente real, aquí se verificaría el hash de la contraseña
    if (user.password !== password) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token
    const token = jwt.sign(
      { 
        id: user.username,
        role: user.role,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        username: user.username,
        role: user.role,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const verifySession = async (req, res) => {
  res.json({ 
    user: {
      username: req.user.id,
      role: req.user.role,
      email: req.user.email
    }
  });
}; 