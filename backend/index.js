import express from "express"
import axios from "axios"
import cors from "cors"

const app = express()
const PORT = process.env.PORT || 3001 // Puerto para el backend

// Configuración de CORS
const corsOptions = {
  origin: ['https://ferremasfrontend.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}

// Middleware
app.use(cors(corsOptions)) // Habilita CORS con las opciones específicas
app.use(express.json()) // Para parsear JSON en las solicitudes

// Endpoint para obtener los artículos
app.get("/api/articulos", async (req, res) => {
  try {
    const apiUrl =
      "https://ea2p2assets-production.up.railway.app/data/articulos"
    const apiKey = "SaGrP9ojGS39hU9ljqbXxQ=="

    const response = await axios.get(apiUrl, {
      headers: {
        "x-authentication": apiKey,
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
app.get("/api/sucursales", async (req, res) => {
  try {
    const apiUrl =
      "https://ea2p2assets-production.up.railway.app/data/sucursales"
    const apiKey = "SaGrP9ojGS39hU9ljqbXxQ=="

    const response = await axios.get(apiUrl, {
      headers: {
        "x-authentication": apiKey,
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

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`)
})
