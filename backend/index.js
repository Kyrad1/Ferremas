const express = require("express")
const axios = require("axios")
const cors = require("cors")
const jwt = require('jsonwebtoken')
const users = require('./data/users.json')
const roles = require('./data/roles.json')

const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_seguro_temporal'
const EXTERNAL_API_KEY = process.env.EXTERNAL_API_KEY || 'SaGrP9ojGS39hU9ljqbXxQ=='

const corsOptions = {
  origin: ['https://ferremasfrontend.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  credentials: true
}

app.use(cors(corsOptions))
app.use(express.json())

// Middleware de autenticación
const verifyToken = (req, res, next) => {
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

// Middleware de autorización
const checkRole = (requiredPermissions) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    
    if (userRole === 'admin') {
      return next();
    }

    if (!roles[userRole]) {
      return res.status(403).json({ message: 'Rol no válido' });
    }

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

// Rutas de autenticación
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;

  try {
    const user = users.users.find(u => u.username === username);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

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
});

app.get("/api/auth/verify", verifyToken, (req, res) => {
  res.json({ 
    user: {
      username: req.user.id,
      role: req.user.role,
      email: req.user.email
    }
  });
});

// Endpoint para obtener los artículos
app.get("/api/articulos", verifyToken, checkRole(['products:read']), async (req, res) => {
  try {
    const apiUrl = "https://ea2p2assets-production.up.railway.app/data/articulos"

    const response = await axios.get(apiUrl, {
      headers: {
        "x-authentication": EXTERNAL_API_KEY,
      },
    })

    res.json(response.data)
  } catch (error) {
    console.error(
      "Error fetching data:",
      error.response ? error.response.data : error.message
    )
    res.status(error.response ? error.response.status : 500).json({
      message: "Error al obtener los datos de la API externa",
      error: error.message,
    })
  }
})

// Endpoint para obtener las sucursales
app.get("/api/sucursales", verifyToken, async (req, res) => {
  try {
    const apiUrl = "https://ea2p2assets-production.up.railway.app/data/sucursales"

    const response = await axios.get(apiUrl, {
      headers: {
        "x-authentication": EXTERNAL_API_KEY,
      },
    })

    res.json(response.data)
  } catch (error) {
    console.error(
      "Error fetching data:",
      error.response ? error.response.data : error.message
    )
    res.status(error.response ? error.response.status : 500).json({
      message: "Error al obtener los datos de la API externa",
      error: error.message,
    })
  }
})

// Endpoint para obtener los vendedores
app.get("/api/vendedores", verifyToken, checkRole(['sellers:read']), async (req, res) => {
  try {
    const apiUrl = "https://ea2p2assets-production.up.railway.app/data/vendedores"

    const response = await axios.get(apiUrl, {
      headers: {
        "x-authentication": EXTERNAL_API_KEY,
      },
    })

    res.json(response.data)
  } catch (error) {
    console.error(
      "Error fetching data:",
      error.response ? error.response.data : error.message
    )
    res.status(error.response ? error.response.status : 500).json({
      message: "Error al obtener los datos de la API externa",
      error: error.message,
    })
  }
})

module.exports = app
