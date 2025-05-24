# Ferremas E-commerce Platform

Una plataforma de comercio electrónico moderna construida con React, TypeScript y Node.js.

## 🚀 Características

- Interfaz de usuario moderna y responsive
- Sistema de pagos integrado con Stripe
- Backend robusto con Node.js
- TypeScript para mayor seguridad de tipos
- Diseño moderno con Tailwind CSS

## 🛠️ Tecnologías

### Frontend
- React
- TypeScript
- Vite
- Stripe Payment Integration
- Tailwind CSS

### Backend
- Node.js
- Express.js
- Stripe API
- Middleware personalizado

## 📦 Estructura del Proyecto

```
ferremas/
├── frontend/           # Aplicación React + TypeScript
│   ├── src/           # Código fuente
│   ├── public/        # Archivos estáticos
│   └── package.json   # Dependencias frontend
│
└── backend/           # Servidor Node.js
    ├── controllers/   # Controladores de la API
    ├── routes/       # Rutas de la API
    ├── middleware/   # Middleware personalizado
    └── config/       # Configuraciones
```

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js (v14 o superior)
- npm o yarn
- Cuenta de Stripe (para procesamiento de pagos)

### Configuración del Frontend

1. Navega al directorio frontend:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` con las siguientes variables:
```env
VITE_STRIPE_PUBLIC_KEY=tu_clave_publica_de_stripe
VITE_API_URL=url_del_backend
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

### Configuración del Backend

1. Navega al directorio backend:
```bash
cd backend
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno necesarias
4. Inicia el servidor:
```bash
npm start
```

## 🔒 Variables de Entorno

### Frontend
- `VITE_STRIPE_PUBLIC_KEY`: Clave pública de Stripe
- `VITE_API_URL`: URL del backend

### Backend
- Configura las variables necesarias según la configuración del servidor

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerencias y mejoras. 