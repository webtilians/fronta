# Hotel AselvIA - Frontend React

## 🏨 Descripción

Aplicación frontend de chat en React para el sistema de reservas del Hotel AselvIA. Proporciona una interfaz moderna y responsive para interactuar con el asistente de IA del hotel, ahora usando **REST API** para comunicación con el backend.

## ✨ Características Principales

### 🎨 Diseño Responsive
- **Pantalla completa**: El chat se adapta al 100% de la pantalla disponible
- **Multi-dispositivo**: Optimizado para desktop, tablet y móvil
- **Diseño moderno**: Interfaz elegante con gradientes y animaciones suaves

### � REST API Integration
- **HTTP Requests**: Comunicación mediante fetch API y endpoints REST
- **Manejo de sesiones**: Sistema de sesiones con localStorage
- **Timeouts y errores**: Manejo robusto de errores y timeouts
- **Health checks**: Verificación automática del estado del servidor

### �️ Panel de Pruebas
- **Testing integrado**: Panel para probar todos los endpoints disponibles
- **Resultados en tiempo real**: Visualización de respuestas y errores
- **Métricas de rendimiento**: Tiempo de respuesta de cada endpoint

### 💬 Chat Inteligente
- **Historial persistente**: Los mensajes se guardan en localStorage
- **Simulación de herramientas**: Muestra qué herramientas está usando el backend
- **Formateo de mensajes**: Soporte para texto enriquecido y emojis
- **Límite de caracteres**: Control de longitud de mensajes

### ♿ Accesibilidad
- **ARIA Labels**: Soporte completo para lectores de pantalla
- **Roles semánticos**: Estructura HTML accesible
- **Navegación por teclado**: Soporte completo para teclado

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 16+ 
- npm o yarn

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crear archivo `.env` en la raíz del proyecto:

```properties
# Para desarrollo local
REACT_APP_API_URL=http://localhost:8000

# Para producción
# REACT_APP_API_URL=https://tu-backend-production.com
```

### 3. Iniciar el servidor de desarrollo
```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 🎯 Endpoints Disponibles

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/chat` | POST | Chat principal con el asistente |
| `/habitaciones` | GET | Listar tipos de habitaciones |
| `/reservas` | GET | Listar todas las reservas |
| `/health` | GET | Estado del servidor |
| `/test` | GET | Página de prueba |

### Ejemplo de uso del endpoint `/chat`:

```javascript
const response = await fetch('http://localhost:8000/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    mensaje: "¿Hay disponibilidad para una habitación doble?",
    historial: [],
    session_id: "session_123456"
  })
});
```

## 🛠️ Herramientas Simuladas

El frontend simula el uso de herramientas basado en el contenido del mensaje:

- **consultar_disponibilidad**: Cuando se menciona "disponibilidad" o "disponible"
- **crear_reserva**: Cuando se menciona "reserva" o "reservar"  
- **listar_tipos_habitaciones**: Cuando se menciona "habitaciones" o "tipos"
- **listar_reservas**: Cuando se menciona "listar reservas" o "ver reservas"
- **analyze_intent**: Para cualquier otra consulta

## 🧪 Panel de Pruebas

Accede al panel de pruebas haciendo clic en el botón 🧪 en el chat. Permite:

- ✅ Probar conexión al servidor (`/health`)
- ✅ Listar habitaciones (`/habitaciones`)
- ✅ Listar reservas (`/reservas`)
- ✅ Enviar mensaje de prueba (`/chat`)
- ⏱️ Ver tiempos de respuesta
- 📊 Visualizar respuestas JSON

## 📱 Responsive Design

### Desktop (1025px+)
- Chat ocupa 90% del viewport con máximo 1200px
- Mensajes hasta 65% de ancho

### Tablet (769px - 1024px)  
- Chat ocupa 95% del viewport con máximo 900px
- Mensajes hasta 70% de ancho

### Móvil (768px-)
- Chat ocupa 100% de la pantalla
- Optimizado para touch

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
