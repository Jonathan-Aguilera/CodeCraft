# 🛠️ CodeCraft

CodeCraft es una plataforma que conecta a desarrolladores con empresas y clientes que buscan servicios tecnológicos. Permite publicar proyectos, postularse y gestionar perfiles profesionales.

## 📦 Tecnologías

- **Backend:** Node.js + Express + TypeScript + Firebase Admin SDK (Firestore, Auth)
- **Frontend:** React + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Base de datos:** Firestore (NoSQL)
- **Autenticación:** Firebase Authentication (próximamente)
- **Despliegue:** (pendiente)

---

## 📁 Estructura del Proyecto

codecraft/ <br>
├── backend/ <br>
│ ├── src/ <br>
│ │ ├── config/ <br>
│ │ │ └── firebase.ts # Configuración de Firebase Admin <br>
│ │ ├── models/ # Interfaces TypeScript de las colecciones <br>
│ │ │ ├── common.types.ts # Tipos compartidos (roles, estados) <br>
│ │ │ ├── user.model.ts <br>
│ │ │ ├── developerProfile.model.ts <br>
│ │ │ ├── project.model.ts <br>
│ │ │ ├── application.model.ts <br>
│ │ │ ├── review.model.ts <br>
│ │ │ └── index.ts <br>
│ │ ├── services/ # Lógica de negocio <br>
│ │ │ └── user.service.ts # CRUD de usuarios <br>
│ │ ├── controllers/ # Manejo de peticiones HTTP <br>
│ │ │ └── user.controller.ts <br>
│ │ ├── routes/ # Definición de endpoints <br>
│ │ │ ├── testRoutes.ts # Rutas de prueba (health, test-db) <br>
│ │ │ └── user.routes.ts <br>
│ │ ├── middlewares/ # Middlewares (validación, autenticación) <br>
│ │ │ └── validation.middleware.ts <br>
│ │ ├── validators/ # Reglas de validación con express-validator <br>
│ │ │ └── user.validator.ts <br>
│ │ ├── utils/ # Helpers (reservado para futuro) <br>
│ │ ├── scripts/ # Scripts de utilidad <br>
│ │ │ └── seed.ts # Carga de datos de prueba <br>
│ │ └── index.ts # Punto de entrada del servidor <br>
│ ├── .env # Variables de entorno (no subir a GitHub) <br>
│ ├── package.json <br>
│ └── tsconfig.json <br>
├── frontend/ # Próximamente... <br>
├── .gitignore <br>
└── README.md <br>

---

## 🚀 Levantar el proyecto en local

#### Requisitos previos
- Node.js (v18 o superior)
- npm o yarn
- Cuenta de Firebase con Firestore habilitado

### Backend

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/TU-USUARIO/CodeCraft.git
   cd CodeCraft
   
2. Configurar variables de entorno:

    Copia el archivo .env.example (si existe) o crea un archivo .env en backend/ con:

    env
        PORT=3000
        FIREBASE_PROJECT_ID=tu-project-id
        FIREBASE_CLIENT_EMAIL=tu-firebase-adminsdk@tu-proyecto.iam.gserviceaccount.com
        FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

3. Instalar dependencias y ejecutar
    
    cd backend
    npm install
    npm run dev

    El servidor estará disponible en http://localhost:3000.


### Frontend (próximamente)

    cd frontend
    npm install
    npm run dev

    📌 Endpoints de Usuarios (API)
        Método	Endpoint	Descripción	Validación
        GET	/api/users/exists?email=...	Verifica si un email ya está registrado	email es requerido y debe ser válido
        GET	/api/users/email?email=...	Obtiene un usuario por email	email es requerido y debe ser válido
        GET	/api/users/:uid	Obtiene un usuario por UID	uid es requerido
        POST	/api/users/	Crea un nuevo usuario	email, role (developer/client/both) requeridos; displayName opcional
        PUT	/api/users/:uid	Actualiza un usuario (parcial)	uid requerido; campos opcionales
        DELETE	/api/users/:uid	Elimina un usuario	uid requerido

## Reglas de negocio aplicadas en los servicios

    Email único: No se pueden crear dos usuarios con el mismo email.

    Rol admin: No se pueden crear ni actualizar usuarios con rol admin desde este servicio (reservado para uso interno).

    Campos inmutables: uid, email y createdAt no se pueden modificar mediante PUT.

        Ejemplo de creación de usuario (POST /api/users/)
            {
                "email": "carlos@example.com",
                "displayName": "Carlos Dev",
                "role": "developer"
            }

        Respuesta exitosa:
            {
                "success": true,
                "message": "Usuario creado exitosamente",
                "user": {
                    "uid": "user_1734567890",
                    "email": "carlos@example.com",
                    "displayName": "Carlos Dev",
                    "photoURL": "",
                    "role": "developer",
                    "createdAt": "2026-08-12T15:30:00Z"
                }
            }

## 🧪 Pruebas con Postman
    Se ha probado el CRUD completo de usuarios con Postman.

    Las validaciones de formato y negocio funcionan correctamente.

    Para futuras pruebas, se recomienda utilizar la colección exportable desde Postman.

## 📝 Script de Seed (Datos de Prueba)

    Para poblar la base de datos con datos iniciales, ejecuta desde backend/:
    
    npm run seed

    Esto creará:

4 usuarios (developer, client, both, admin).

2 perfiles de desarrollador (para el developer y el both).

1 proyecto, 2 aplicaciones y 2 reseñas.

## 🤝 Contribuciones
Este es un proyecto personal de Time Storm Creations "TSC" a cargo de Jonathan Aguilera. Por ahora no se aceptan contribuciones externas, pero se agradecen sugerencias.

## 📧 Contacto

- Gmail: timestormcreations@gmail.com
- linkedin: www.inkedin.com/in/jonathanfullstack