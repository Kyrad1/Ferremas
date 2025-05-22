const express = require("express")
const axios = require("axios")
const cors = require("cors")
const jwt = require('jsonwebtoken')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
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

// Configuración de middleware
app.use(cors(corsOptions))

// Webhook de Stripe debe estar ANTES de express.json()
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }))

// Parseo de JSON para todas las demás rutas
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

// Endpoint para obtener un producto específico por ID
app.get("/api/articulos/:id", verifyToken, checkRole(['products:read']), async (req, res) => {
  try {
    const apiUrl = "https://ea2p2assets-production.up.railway.app/data/articulos"
    const response = await axios.get(apiUrl, {
      headers: {
        "x-authentication": EXTERNAL_API_KEY,
      },
    })

    const articulo = response.data.find(art => art.id === req.params.id)
    
    if (!articulo) {
      return res.status(404).json({ message: "Artículo no encontrado" })
    }

    res.json(articulo)
  } catch (error) {
    console.error("Error fetching data:", error.response ? error.response.data : error.message)
    res.status(error.response ? error.response.status : 500).json({
      message: "Error al obtener los datos de la API externa",
      error: error.message,
    })
  }
})

// Endpoint para marcar/desmarcar producto como novedad
app.post("/api/articulos/:id/novedad", verifyToken, checkRole(['products:write']), async (req, res) => {
  try {
    const { isNovedad } = req.body
    const articuloId = req.params.id

    // Primero verificamos que el artículo existe
    const apiUrl = "https://ea2p2assets-production.up.railway.app/data/articulos"
    const response = await axios.get(apiUrl, {
      headers: {
        "x-authentication": EXTERNAL_API_KEY,
      },
    })

    const articulo = response.data.find(art => art.id === articuloId)
    
    if (!articulo) {
      return res.status(404).json({ message: "Artículo no encontrado" })
    }

    // Aquí normalmente actualizaríamos en una base de datos
    // Como estamos usando JSON, simularemos la respuesta
    res.json({
      ...articulo,
      isNovedad: isNovedad
    })
  } catch (error) {
    console.error("Error updating data:", error.response ? error.response.data : error.message)
    res.status(error.response ? error.response.status : 500).json({
      message: "Error al actualizar el artículo",
      error: error.message,
    })
  }
})

// Endpoint para marcar/desmarcar producto como promoción
app.post("/api/articulos/:id/promocion", verifyToken, checkRole(['products:write']), async (req, res) => {
  try {
    const { isPromocion, descuento } = req.body
    const articuloId = req.params.id

    // Primero verificamos que el artículo existe
    const apiUrl = "https://ea2p2assets-production.up.railway.app/data/articulos"
    const response = await axios.get(apiUrl, {
      headers: {
        "x-authentication": EXTERNAL_API_KEY,
      },
    })

    const articulo = response.data.find(art => art.id === articuloId)
    
    if (!articulo) {
      return res.status(404).json({ message: "Artículo no encontrado" })
    }

    // Aquí normalmente actualizaríamos en una base de datos
    // Como estamos usando JSON, simularemos la respuesta
    res.json({
      ...articulo,
      isPromocion: isPromocion,
      descuento: descuento
    })
  } catch (error) {
    console.error("Error updating data:", error.response ? error.response.data : error.message)
    res.status(error.response ? error.response.status : 500).json({
      message: "Error al actualizar el artículo",
      error: error.message,
    })
  }
})

// Endpoint para obtener solo productos en promoción
app.get("/api/articulos/promociones", verifyToken, checkRole(['products:read']), async (req, res) => {
  try {
    const apiUrl = "https://ea2p2assets-production.up.railway.app/data/articulos"
    const response = await axios.get(apiUrl, {
      headers: {
        "x-authentication": EXTERNAL_API_KEY,
      },
    })

    // Filtramos los artículos que están en promoción
    // Como no tenemos una base de datos, simularemos que los artículos con precio terminado en 99 están en promoción
    const promociones = response.data.filter(art => art.precio.toString().endsWith('99'))

    res.json(promociones)
  } catch (error) {
    console.error("Error fetching data:", error.response ? error.response.data : error.message)
    res.status(error.response ? error.response.status : 500).json({
      message: "Error al obtener los datos de la API externa",
      error: error.message,
    })
  }
})

// Endpoint para obtener solo productos marcados como novedades
app.get("/api/articulos/novedades", verifyToken, checkRole(['products:read']), async (req, res) => {
  try {
    const apiUrl = "https://ea2p2assets-production.up.railway.app/data/articulos"
    const response = await axios.get(apiUrl, {
      headers: {
        "x-authentication": EXTERNAL_API_KEY,
      },
    })

    // Filtramos los artículos que son novedades
    // Como no tenemos una base de datos, simularemos que los artículos más caros son novedades
    const novedades = response.data
      .sort((a, b) => b.precio - a.precio)
      .slice(0, 5)

    res.json(novedades)
  } catch (error) {
    console.error("Error fetching data:", error.response ? error.response.data : error.message)
    res.status(error.response ? error.response.status : 500).json({
      message: "Error al obtener los datos de la API externa",
      error: error.message,
    })
  }
})

// Endpoint para obtener un vendedor específico por ID
app.get("/api/vendedores/:id", verifyToken, checkRole(['sellers:read']), async (req, res) => {
  try {
    const apiUrl = "https://ea2p2assets-production.up.railway.app/data/vendedores"
    const response = await axios.get(apiUrl, {
      headers: {
        "x-authentication": EXTERNAL_API_KEY,
      },
    })

    const vendedor = response.data.find(v => v.id === req.params.id)
    
    if (!vendedor) {
      return res.status(404).json({ message: "Vendedor no encontrado" })
    }

    res.json(vendedor)
  } catch (error) {
    console.error("Error fetching data:", error.response ? error.response.data : error.message)
    res.status(error.response ? error.response.status : 500).json({
      message: "Error al obtener los datos de la API externa",
      error: error.message,
    })
  }
})

// Endpoint para solicitar contacto con un vendedor
app.post("/api/vendedores/:id/contacto", verifyToken, async (req, res) => {
  try {
    const vendedorId = req.params.id
    const { mensaje, tipo_contacto } = req.body
    const usuario = req.user

    // Primero verificamos que el vendedor existe
    const apiUrl = "https://ea2p2assets-production.up.railway.app/data/vendedores"
    const response = await axios.get(apiUrl, {
      headers: {
        "x-authentication": EXTERNAL_API_KEY,
      },
    })

    const vendedor = response.data.find(v => v.id === vendedorId)
    
    if (!vendedor) {
      return res.status(404).json({ message: "Vendedor no encontrado" })
    }

    // Aquí normalmente enviaríamos un email o notificación al vendedor
    // Como es un ejemplo, solo simularemos la respuesta
    res.json({
      message: "Solicitud de contacto enviada exitosamente",
      detalles: {
        vendedor: vendedor.nombre,
        cliente: usuario.id,
        fecha: new Date().toISOString(),
        estado: "pendiente",
        tipo_contacto,
        mensaje
      }
    })
  } catch (error) {
    console.error("Error sending contact request:", error.response ? error.response.data : error.message)
    res.status(error.response ? error.response.status : 500).json({
      message: "Error al enviar la solicitud de contacto",
      error: error.message,
    })
  }
})

// Simulación de almacenamiento de pedidos
const pedidosSimulados = new Map()

// Endpoint para crear un pedido nuevo
app.post("/data/pedidos/nuevo", verifyToken, checkRole(['orders:create']), async (req, res) => {
  try {
    const { articuloId, cantidad, direccionEntrega } = req.body
    const usuario = req.user

    // Verificar que el artículo existe y hay stock
    const apiUrl = "https://ea2p2assets-production.up.railway.app/data/articulos"
    const response = await axios.get(apiUrl, {
      headers: {
        "x-authentication": EXTERNAL_API_KEY,
      },
    })

    const articulo = response.data.find(art => art.id === articuloId)
    
    if (!articulo) {
      return res.status(404).json({ message: "Artículo no encontrado" })
    }

    if (articulo.stock < cantidad) {
      return res.status(400).json({ 
        message: "Stock insuficiente",
        stockDisponible: articulo.stock
      })
    }

    // Crear pedido simulado
    const pedidoId = `PED-${Date.now()}`
    const nuevoPedido = {
      id: pedidoId,
      articuloId,
      cantidad,
      direccionEntrega,
      estado: "pendiente",
      fechaCreacion: new Date().toISOString(),
      total: articulo.precio * cantidad,
      clienteId: usuario.id,
      articulo: {
        id: articulo.id,
        nombre: articulo.nombre,
        precio: articulo.precio,
        descripcion: articulo.descripcion
      }
    }

    // Guardar en el almacenamiento simulado
    pedidosSimulados.set(pedidoId, nuevoPedido)

    res.json(nuevoPedido)
  } catch (error) {
    console.error("Error creating order:", error.response ? error.response.data : error.message)
    res.status(error.response ? error.response.status : 500).json({
      message: "Error al crear el pedido",
      error: error.message,
    })
  }
})

// Endpoint para obtener los pedidos del usuario
app.get("/data/pedidos", verifyToken, checkRole(['orders:read']), async (req, res) => {
  try {
    const usuario = req.user
    
    // Filtrar pedidos del usuario
    const pedidosUsuario = Array.from(pedidosSimulados.values())
      .filter(pedido => pedido.clienteId === usuario.id)
      .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())

    res.json(pedidosUsuario)
  } catch (error) {
    console.error("Error fetching orders:", error)
    res.status(500).json({
      message: "Error al obtener los pedidos",
      error: error.message,
    })
  }
})

// Endpoint para obtener un pedido específico
app.get("/data/pedidos/:id", verifyToken, checkRole(['orders:read']), async (req, res) => {
  try {
    const pedidoId = req.params.id
    const usuario = req.user

    const pedido = pedidosSimulados.get(pedidoId)
    
    if (!pedido) {
      return res.status(404).json({ message: "Pedido no encontrado" })
    }

    // Verificar que el pedido pertenece al usuario
    if (pedido.clienteId !== usuario.id && usuario.role !== 'admin') {
      return res.status(403).json({ message: "No tienes permiso para ver este pedido" })
    }

    res.json(pedido)
  } catch (error) {
    console.error("Error fetching order:", error)
    res.status(500).json({
      message: "Error al obtener el pedido",
      error: error.message,
    })
  }
})

// Rutas de pago
app.post("/api/payments/create-payment-intent", verifyToken, async (req, res) => {
  const { pedidoId, amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe works with cents
      currency: 'clp',
      metadata: {
        pedidoId,
        integration_check: 'accept_a_payment'
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(400).json({ 
      message: error.message || 'Error al procesar el pago' 
    });
  }
});

// Rutas
app.use('/api/payments', require('./routes/paymentRoutes'));

module.exports = app
