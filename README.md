# Proyecto MEDISTOCK - API RESTful

## Descripción
Como propósito principal esta API va a actuar como el nucleo de la integración y gestión automatizada de la distribuidora MEDISTOCK, donde se va a centralizar la lógica del negocio, permitiendo que diferentes plataformas interactúen con una única fuente de verdad en tiempo real

## Stack Tecnológico
* Lenguaje: JavaScript
* Framework: Express.js y Angular
* Base de Datos: MongoDB
* Herramientas de Construcción: NPM
* Librerías: Mongoose, Bcryptjs, Dotenv, CORS

## Estructura de Carpetas
En la carpeta de server es donde se hace la conexión con la base de datos y donde se encuentran las carpetas del controller y los models mientras que en src es donde van a estar las vistas
* `controller/`: Se encarga de recibir las peticiones HTTP, procesar los datos y enviar las respuestas al cliente.
* `config/`: Es el centro de configuración y conexión del servidor.
* `model/`: Contiene la definición de los esquemas de datos utilizando Mongoose.

## Configuración e Instalación
1. Clonar el repositorio.
2. Configurar el archivo de propiedades (database, puerto).
3. npm install
   npm run dev

## Documentación de Arquitectura (Modelo 4+1)
Acceso a los diagramas de despliegue, comunicación y paquetes:
* [Carpeta Compartida de Diagramas](https://drive.google.com/drive/folders/1E4u9zYEDC-jMzAcBr26QIJ7sw0ehBlYC?usp=sharing)

## Pruebas de API
* Postman: Existen datos en la base de datos que si bien no tienen relacion con el caso estos si se pueden borrar, listar como se muestra en el video que esta en la carpeta junto con los diagramas.