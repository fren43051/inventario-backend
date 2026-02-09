# Inventario Backend 📦

Sistema de gestión de inventario backend desarrollado con JavaScript/Node.js.

## 📋 Descripción

API RESTful para la gestión completa de inventario. Permite administrar productos, registros de entrada/salida y control de stock.

## ✨ Características

- ✅ Gestión completa de items (CRUD)
- �� Búsqueda y filtrado avanzado
- 👤 Autenticación de usuarios
- 📊 Reportes de inventario
- 🔐 Control de permisos por roles
- 📱 API RESTful

## 🚀 Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn
- Base de datos (especificar cuál utilizas)

## 📦 Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/fren43051/inventario-backend.git
cd inventario-backend
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**
```bash
cp .env.example .env
# Edita .env con tus configuraciones
```

4. **Ejecutar la aplicación:**
```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 🛠️ Scripts Disponibles

```bash
npm start          # Inicia el servidor en producción
npm run dev        # Inicia el servidor en modo desarrollo
npm test           # Ejecuta los tests
npm run lint       # Ejecuta el linter
```

## 📚 Documentación API

La documentación detallada de los endpoints está disponible en la carpeta `docs/`. También puedes acceder a ella en:
- `/api/docs` - Documentación Swagger (si está configurada)

### Endpoints Principales

- `GET /api/items` - Obtener todos los items
- `POST /api/items` - Crear nuevo item
- `GET /api/items/:id` - Obtener item específico
- `PUT /api/items/:id` - Actualizar item
- `DELETE /api/items/:id` - Eliminar item

## 🗄️ Estructura del Proyecto

```
src/
├── controllers/    # Lógica de controladores
├── models/        # Modelos de datos
├── routes/        # Definición de rutas
├── middleware/    # Middleware personalizado
├── utils/         # Funciones auxiliares
└── config/        # Configuración
```

## 🔐 Autenticación

Los endpoints protegidos requieren un token JWT en el header:
```bash
Authorization: Bearer <token>
```

## 🤝 Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia [especificar licencia]. Ver `LICENSE` para más detalles.

## 📞 Contacto

**Autor:** fren43051

Para preguntas o sugerencias, abre un [issue](https://github.com/fren43051/inventario-backend/issues)

## 📝 Changelog

Ver [CHANGELOG.md](./CHANGELOG.md) para un historial de cambios.

---

**Estado del Proyecto:** En desarrollo ⚙️