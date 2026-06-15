# 🐾 Sanos y Salvos - Frontend

¡Bienvenido al repositorio frontend de **Sanos y Salvos**! Esta es una aplicación web interactiva y progresiva (PWA) diseñada para reportar, mapear y conectar reportes de mascotas perdidas y avistadas, con el fin de reunirlas con sus familias de la manera más rápida y eficiente posible.

El sistema utiliza **inteligencia artificial integrada en el navegador** y mapas interactivos en tiempo real para generar coincidencias automatizadas entre los reportes de la comunidad.

---

## ✨ Características Principales

*   🗺️ **Mapa Interactivo en Tiempo Real:** Visualización dinámica de incidentes y avistamientos utilizando **Mapbox GL JS** con marcadores personalizados (fotos de las mascotas) y geolocalización del usuario.
*   🧠 **Algoritmo de Coincidencias con IA (TensorFlow.js + MobileNet):**
    *   Compara reportes de mascotas perdidas con reportes de avistamientos.
    *   Calcula similitud de metadatos (especie, color, raza, tamaño).
    *   Extrae vectores de embeddings de las fotos de las mascotas usando **MobileNet** directamente en el cliente para calcular la similitud de imagen mediante **distancia coseno**.
*   🏆 **Sistema de Coincidencias y Recompensas (Rewards):** Los usuarios que reportan avistamientos desbloquean cupones de descuento y beneficios exclusivos como agradecimiento de la comunidad.
*   📝 **Reporte de Incidentes Completo:** Formulario intuitivo de publicación con carga múltiple de imágenes, detección automática de dirección mediante geocodificación inversa de Mapbox, y selección de tipo de incidente (Mascota Perdida / Mascota Avistada).
*   📱 **Aplicación Web Progresiva (PWA):** Configurada para poder instalarse en dispositivos móviles y brindar una experiencia fluida tipo app nativa mediante `vite-plugin-pwa`.
*   🎭 **Animaciones Modernas:** Transiciones y micro-interacciones pulidas gracias al uso de **GSAP**.
*   🛡️ **Panel de Administración (Dashboard):** Sección exclusiva y protegida para administradores para gestionar, editar y dar de baja reportes de la plataforma.

---

## 🛠️ Tecnologías y Librerías

El frontend está construido sobre el siguiente stack tecnológico:

*   **Framework Principal:** [React 19](https://react.dev/)
*   **Herramienta de Construcción:** [Vite](https://vite.dev/)
*   **Estilos y Layout:** [Bootstrap 5](https://getbootstrap.com/) y CSS personalizado.
*   **Enrutado:** [React Router Dom v7](https://reactrouter.com/)
*   **Mapas y Geolocalización:** [Mapbox GL JS](https://www.mapbox.com/)
*   **Inteligencia Artificial (Embeddings):** [TensorFlow.js](https://www.tensorflow.org/js) & [MobileNet Model](https://github.com/tensorflow/tfjs-models/tree/master/mobilenet)
*   **Animaciones:** [GSAP (GreenSock Animation Platform)](https://gsap.com/)
*   **Pruebas Unitarias:** [Vitest](https://vitest.dev/)

---

## 📂 Estructura de Carpetas

A continuación se detalla la estructura principal del código fuente (`src/`):

```bash
src/
├── api/                  # Servicios de comunicación con el backend e integraciones externas
│   ├── api.js            # Configuración base de Fetch API / BFF de la aplicación
│   ├── authService.js    # Servicio de autenticación (Login/Registro)
│   ├── mapboxService.js  # Integración con la API de Geocodificación de Mapbox
│   └── reportService.js  # Servicio para creación y obtención de reportes
├── assets/               # Recursos estáticos locales
│   └── css/              # Hojas de estilo personalizadas de componentes y páginas
├── components/           # Componentes reutilizables de la aplicación
│   ├── AdminRoute.jsx    # Protector de rutas de administración
│   ├── AuthLayout.jsx    # Contenedor para vistas de inicio de sesión/registro
│   ├── Carousel.jsx      # Carrusel interactivo de imágenes
│   └── MainNavbar.jsx    # Barra de navegación superior
├── context/              # Contextos globales de React (ej. AuthContext)
├── mappers/              # Transformadores y formateadores de datos API a componentes
├── pages/                # Páginas principales (Vistas)
│   ├── AccountPage.jsx   # Gestión del perfil de usuario
│   ├── Dashboard.jsx     # Panel de administración de reportes
│   ├── Home.jsx          # Página de bienvenida / Landing Page
│   ├── Login.jsx         # Inicio de sesión de usuarios
│   ├── MapPage.jsx       # Mapa interactivo de reportes
│   ├── MatchesRewardsPage.jsx # Coincidencias de IA y Cupones/Recompensas
│   ├── Register.jsx      # Registro de nuevas cuentas
│   └── ReportPage.jsx    # Creación de reportes de pérdidas y avistamientos
├── utils/                # Utilidades, formateadores y funciones del algoritmo de matching
└── main.jsx              # Punto de entrada de la aplicación
```

---

## ⚙️ Instalación y Configuración

Sigue estos pasos para levantar el proyecto localmente:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/RenatoLT/FrontEndSanosSalvos.git
   cd FrontEndSanosSalvos
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Variables de Entorno (Opcional):**
   * El servicio BFF apunta por defecto a `http://localhost:8090/api/bff` (definido en [api.js](file:///d:/Coding/react/FrontEndSanos/src/api/api.js)).
   * Asegúrate de tener el Backend de la aplicación en ejecución.

4. **Ejecutar en Entorno de Desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:5173](http://localhost:5173) en tu navegador para ver la aplicación.

---

## 🧪 Pruebas Unitarias y Calidad

El proyecto incluye suites de pruebas unitarias para validar el mapeo de datos y los servicios. Para ejecutar los tests:

*   **Ejecutar pruebas una sola vez:**
    ```bash
    npm run test
    ```
*   **Ejecutar pruebas en modo observador (watch):**
    ```bash
    npm run test:watch
    ```
*   **Ejecutar análisis estático de código (Linter):**
    ```bash
    npm run lint
    ```

---

## 🚀 Despliegue y Compilación

Para generar el bundle optimizado para producción:

```bash
npm run build
```

Los archivos de distribución se generarán en la carpeta `/dist`, listos para ser servidos por cualquier servidor web estático.
