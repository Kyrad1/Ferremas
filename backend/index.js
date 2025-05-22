import express from "express"
import axios from "axios"
import cors from "cors"

const app = express()
const PORT = process.env.PORT || 3001 // Puerto para el backend

// Middleware
app.use(cors()) // Habilita CORS para todas las rutas
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

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`)
})
