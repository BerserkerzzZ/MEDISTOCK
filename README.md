# Proyecto MEDISTOCK - API RESTful

## Descripción
Como propósito principal esta API va a actuar como el nucleo de la integración y gestión automatizada de la distribuidora MEDISTOCK, donde se va a centralizar la lógica del negocio, permitiendo que diferentes plataformas interactúen con una única fuente de verdad en tiempo real

## Stack Tecnológico

* Herramientas de Construcción: NPM
* Librerías: Mongoose, Bcryptjs, Dotenv, CORS
Backend
* Runtime: Node.js 
* Framework: Express.js
* Base de Datos: MongoDB Atlas
* Pasarela de Pago: Transbank SDK
* Librerías Críticas: Mongoose

Frontend
* Framework: Angular
* Plataforma Híbrida: Ionic Framework
* Despliegue: Vercel
* Túnel de Desarrollo: ngrok

## Estructura de Carpetas
Backend
* config: conexión a la base de datos
* controllers: lógica de negocio, aquí están las funciones divididas en usuarios, productos, pedido, auth y webpay.
* helpers: validación de JWT
* models: esquemas de Mongoose Usuario Pedido y Producto
* routes: definición de endpoints, conecta las URLs con los controllers
* index.js: punto de entrada, levanta Express, conecta middlewares y registra las rutas
* variable.env: variables de entorno como MONGO_URI,
Frontend
* guards: AuthGuard que verifica si hay token antes de dejar entrar a páginas privadas
* home: página principal con su HTML, SCSS, TS 
* models: interfaces TypeScript que definen la forma de los datos que vienen del backend
* pages: aquí viven las páginas secundarias organizadas por dominio:
   * producto: catálogo, admin-productos y carrito.
   * usuario: login, registro, mis-compras.
* services: servicios de Angular que hacen las llamadas HTTP al backend
* environments: environment.ts con la URL del backend para dev y prod

## Configuración e Instalación

Backend

* clonar e instalar dependencias
   * cd server
   * npm install
* ejecutar desarrollo
   * npm run dev
   * ngrok http 3000

Frontend

* instalar dependencias
   * cd server
   * npm install
* ejecutar desarrollo
   * ionic serve

## Documentación de Arquitectura (Modelo 4+1)
Acceso a los diagramas de despliegue, comunicación y paquetes:
* [Carpeta Compartida de Diagramas](https://drive.google.com/drive/folders/1E4u9zYEDC-jMzAcBr26QIJ7sw0ehBlYC?usp=sharing)

## Pruebas de API
* Postman: Existen datos en la base de datos que si bien no tienen relacion con el caso estos si se pueden borrar, listar como se muestra en el video que esta en la carpeta junto con los diagramas.