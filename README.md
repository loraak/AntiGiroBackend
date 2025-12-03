
# AntiGiro Backend

## Tecnologías

* **Core:** [Node.js](https://nodejs.org/) y [Express v5](https://expressjs.com/).
* **Base de Datos (Híbrida):**
    * [MySQL](https://www.mysql.com/) (Relacional) - Vía `mysql2`.
    * [MongoDB](https://www.mongodb.com/) (NoSQL) - Vía `mongoose`.
* **Seguridad:**
    * [JWT (JSON Web Tokens)](https://jwt.io/) para manejo de sesiones.
    * [Bcrypt.js](https://www.npmjs.com/package/bcryptjs) para hashing de contraseñas.
* **Documentación:**
    * [Swagger](https://swagger.io/) (Swagger UI Express).

---

## Requisitos Previos

Para ejecutar este proyecto localmente necesitas:

1.  **Node.js** (v18+ recomendado).
2.  **Servidor MySQL**:
    * Si usas **XAMPP**, asegúrate de iniciar el servicio "MySQL" desde el panel de control.
3.  **Servidor MongoDB**:
    * Debes tener instalado MongoDB Community Server localmente o usar una conexión a MongoDB Atlas.

---

## Instalación

### 1. Clonar el repositorio
```bash
git clone [https://github.com/loraak/AntiGiroBackend.git](https://github.com/loraak/AntiGiroBackend.git)
cd AntiGiroBackend
````

### 2\. Instalar dependencias

```bash
npm install
```

### 3\. Configuración de Entorno (.env)

Crea un archivo llamado `.env` en la raíz del proyecto y configura tus variables.

```env
# Configuración del Servidor
PORT=4000
NODE_ENV=development

# Base de Datos MySQL (Usando XAMPP por defecto)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=antigiro_db
DB_PORT=3306

# Base de Datos MongoDB
MONGO_URI=mongodb:linkalabasededatosmongo

# Seguridad
JWT_SECRET=unagranllavesecreta
```

## Ejecución

### Modo Desarrollo (con Nodemon)

```bash
npm run dev
```

### Modo Producción

Para dejar el servidor corriendo:

```bash
npm start
```

El servidor debería iniciar en: `http://localhost:3000` (o el puerto definido).

-----

## Documentación de API (Swagger)

Este proyecto incluye documentación automática de los endpoints. Una vez iniciado el servidor, visita:

**[http://localhost:3000/api-docs](https://www.google.com/search?q=http://localhost:4000/api-docs)**

Aquí podrás probar los endpoints desde el navegador. 

-----

## Integración con Frontend y XAMPP

1.  **MySQL:** Tu backend de Node se conectará al puerto `3306` de XAMPP. Mantén XAMPP abierto con el módulo MySQL en "Start".
2.  **Apache (Frontend):** Si tienes el React frontend en `htdocs` (puerto 80), y este backend en el puerto `4000`, asegúrate de que el frontend apunte a `http://localhost:4000` en sus peticiones Axios.
3.  **CORS:** El paquete `cors` ya está instalado. Asegúrate en tu `app.js` de permitir peticiones desde el origen de tu frontend (ej. `http://localhost` o `http://localhost:3000`).

-----

## Licencia

Este proyecto está bajo la licencia **ISC**.
