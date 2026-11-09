# Notflix

**Clásicos del cine, gratis y 0 % piratas.** Una plataforma de streaming full stack con películas y series
de dominio público: Nosferatu, Keaton, Chaplin, Romero, cine negro y los Superman de los Fleischer.

**En vivo:** https://notflix-v2.vercel.app · API: https://notflix-api-hep2.onrender.com/swagger-ui.html

Notflix nació en 2022 como proyecto final del ciclo 4 de Misión TIC 2022. Lo lideró Santiago Velasco
([@thevutman](https://github.com/thevutman)) con la ayuda de Marcela Ríos P ([@Mriosp02](https://github.com/Mriosp02)),
[@savendanog](https://github.com/savendanog) y [@dannyshernandezg](https://github.com/dannyshernandezg). Se apagó cuando la cuenta institucional de MongoDB se cerró y la base de datos
desapareció. En 2026 se renovó por completo: misma idea, mismo back-end en Spring Boot y mismas rutas de la
API, el mismo diseño de 2022 (logo, paleta, cajitas, rutas) y por dentro seguridad real, datos reales y un catálogo que no puede quedarse vacío.

## Qué tiene

- **Catálogo**: las cajitas de Películas y Series por categoría, Mi lista y lo más visto (cuenta real de reproducciones).
- **Reproductor**: las copias se sirven desde Internet Archive; las series muestran sus episodios.
- **Cuentas**: registro, login con JWT, "Entrar como invitado" para recorrerlo sin registrarse y edición de la cuenta.
- **Mi lista**: el corazón de cada título guarda tus favoritos.
- **Búsqueda** por título, actor, director o episodio.
- **Administración**: crear, editar y borrar títulos solo con rol de administrador.

## Stack

| Capa | Tecnología |
| --- | --- |
| API | Java 17+, Spring Boot 3.3, Spring Security (JWT + BCrypt), Spring Data MongoDB, Bean Validation, springdoc (Swagger) |
| Base de datos | MongoDB Atlas (producción) · MongoDB embebido (desarrollo y pruebas, sin instalar nada) |
| Front-end | React 19, TypeScript, Vite, Tailwind CSS 4, React Router 7 |
| Publicación | Render (API en Docker) · Vercel (front-end) |

## Qué cambió frente a 2022

| 2022 | 2026 |
| --- | --- |
| El "token" era `email:contraseña` en base64, enviado en cada petición | JWT firmado que expira; la contraseña viaja una sola vez |
| El login estaba comentado y "Entrar" saltaba directo al catálogo | Login real con errores claros y modo invitado |
| La URL de MongoDB, con usuario y contraseña, estaba en el código | Toda la configuración sale de variables de entorno |
| Si la base de datos se vaciaba, la app quedaba en blanco | El catálogo se carga solo al arrancar (`seed/catalog.json`) |
| El reporte buscaba un id fijo de la base vieja | `/api/catalog/report` cuenta reproducciones reales |
| Cualquiera podía crear o borrar películas | Escribir en el catálogo exige rol de administrador |
| "Duración", "actores" y "director" eran texto de ejemplo | Datos reales de cada película |
| Sin pruebas | Pruebas de integración contra MongoDB real (`ApiFlowTests`) |
| Diseño en SCSS | El mismo diseño (colores `#1F1D1D`, `#121212`, `#81161C`, logo, esquinas de 50 px, cajitas) en Tailwind, ahora responsive de verdad |

## Correr en local

Necesitas Java 17 o más nuevo y Node 20 o más nuevo. No hace falta instalar MongoDB: el back descarga y arranca
uno embebido la primera vez (tarda un par de minutos solo esa vez).

```bash
# API en http://localhost:8080 (Swagger en /swagger-ui.html)
cd backend
./mvnw spring-boot:run

# Front-end en http://localhost:5173
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Pruebas: `cd backend && ./mvnw test`.

## API

| Método | Ruta | Acceso |
| --- | --- | --- |
| `GET` | `/api/catalog` · `/api/catalog/search?q=` · `/api/catalog/report` | Público |
| `GET` | `/api/movie` · `/api/movie/{id o slug}` (igual para `/api/series`) | Público |
| `POST` | `/api/movie/{id}/play` | Público |
| `GET` | `/api/category` | Público |
| `POST` | `/api/auth` · `/api/auth/guest` · `/api/client` (registro) | Público |
| `GET` `PUT` `DELETE` | `/api/client/me` | Con sesión |
| `GET` `POST` | `/api/score` · `GET /api/score/check/{id}` · `DELETE /api/score/{id}` | Con sesión |
| `POST` `PUT` `DELETE` | `/api/movie` · `/api/series` | Administrador |

## Publicar

1. **MongoDB Atlas**: crea un clúster gratis (M0), un usuario de base de datos y permite el acceso desde cualquier IP
   (`0.0.0.0/0`, Render no tiene IP fija). Copia la cadena de conexión `mongodb+srv://…`.
2. **Render**: *New → Blueprint* y elige este repositorio; `render.yaml` crea el servicio. Escribe `MONGODB_URI` y
   `ALLOWED_ORIGINS` (la URL de Vercel). `JWT_SECRET` y `GUEST_PASSWORD` se generan solos.
3. **Vercel**: importa el repositorio con *Root Directory* `frontend` y la variable
   `VITE_API_URL=https://<tu-servicio>.onrender.com/api`.

En el plan gratis de Render la API se duerme tras 15 minutos sin uso; la primera visita tarda unos segundos y la
interfaz lo avisa ("Encendiendo el proyector…").

## Créditos

Películas de dominio público servidas por [Internet Archive](https://archive.org). Afiches e imágenes de
[Wikimedia Commons](https://commons.wikimedia.org) (dominio público); `npm run images` los vuelve a descargar.
Notflix no tiene relación con ningún servicio de streaming comercial.
