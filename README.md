# omar-portfolio

Portfolio personal de **Omar Garcia** — Cloud & DevOps Engineer.

---

## Estructura del proyecto

```
omar-portfolio/
├── src/
│   ├── app/
│   │   ├── globals.css       # Estilos globales, variables CSS, animaciones CRT
│   │   ├── layout.tsx        # Root layout: fuente, metadata SEO, Navbar, StatusBar
│   │   └── page.tsx          # Única página: apila todas las secciones
│   ├── components/           # Un componente por archivo, sin subcarpetas
│   │   ├── Navbar.tsx        # Navegación fija superior con detección de sección activa
│   │   ├── StatusBar.tsx     # Barra inferior estilo terminal con reloj y latencia en vivo
│   │   ├── TerminalText.tsx  # Efecto de escritura carácter a carácter
│   │   ├── SectionTitle.tsx  # Encabezado reutilizable para cada sección
│   │   ├── Hero.tsx          # Presentación + typing effect + ventana terminal
│   │   ├── About.tsx         # Resumen personal + estadísticas
│   │   ├── Skills.tsx        # Barras de progreso animadas por categoría
│   │   ├── Experience.tsx    # Historial laboral estilo log de terminal
│   │   ├── Education.tsx     # Estudios formales + certificaciones
│   │   ├── Portfolio.tsx     # Proyectos con highlights, tags y links
│   │   └── Contact.tsx       # Formulario → API Gateway → Lambda → SNS
│   └── lib/
│       └── data.ts           # Interfaces TypeScript + todo el contenido del sitio
├── .env.local.example        # Variable de entorno para el endpoint de contacto
├── next.config.ts            # output: "export" para S3, imágenes sin optimizar
├── tailwind.config.ts        # Paleta de colores terminal + animaciones personalizadas
└── package.json
```

---

## Inicio rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variable de entorno
cp .env.local.example .env.local
# Edita .env.local con la URL de tu API Gateway (después del terraform apply)

# 3. Servidor de desarrollo
npm run dev
# → http://localhost:3000
```

---

## Build para producción

```bash
npm run build
# Genera la carpeta /out con el sitio estático listo para subir a S3
```

---

## Personalización

Todo el contenido editable está en **`src/lib/data.ts`**:

| Exportación         | Qué controla                              |
|---------------------|-------------------------------------------|
| `SITE`              | Nombre, email, redes sociales, handle     |
| `NAV_LINKS`         | Secciones del menú de navegación          |
| `SKILL_CATEGORIES`  | Categorías y niveles de habilidades       |
| `EXPERIENCES`       | Historial laboral                         |
| `EDUCATIONS`        | Estudios formales                         |
| `CERTIFICATIONS`    | Certificaciones profesionales             |
| `PROJECTS`          | Proyectos del portfolio                   |
| `API_ENDPOINT`      | URL del formulario (desde `.env.local`)   |

---

## Infraestructura (próximo paso)

El sitio está preparado para desplegarse sobre:

```
AWS
───────────────────────────────────────────────────
→   CloudFront + WAF
→   S3 Block Public Access (solo OAC)
→   API GW + Throttling por IP
→   Lambda → SES (emails HTML)
→   Lambda → DynamoDB (leads guardados)
→   CloudWatch (logs + alarmas)
→   Lambda env vars / SSM Parameter Store

                                    ┌─────────────────────────────────────────┐
                                    │              Route53                     │
                                    │         omargarcia.xyz                   │
                                    └──────────────────┬──────────────────────┘
                                                       │
                                    ┌──────────────────▼──────────────────────┐
                                    │              CloudFront                  │
                                    │     CDN + HTTPS + Caché Global           │
                                    │         + WAF (protección)               │
                                    └──────────┬───────────────┬──────────────┘
                                               │               │
                          ┌────────────────────▼──┐    ┌──────▼────────────────────┐
                          │          S3            │    │       API Gateway          │
                          │  Archivos estáticos    │    │   POST /contact + Throttle │
                          │  /out (solo CloudFront)│    └──────────────┬────────────┘
                          │  Block Public Access   │                   │
                          └───────────────────────┘    ┌──────────────▼────────────┐
                                                        │          Lambda            │
                                                        │   - Valida formulario      │
                                                        │   - Guarda en DynamoDB     │
                                                        │   - Envía email con SES    │
                                                        └──────┬───────────┬─────────┘
                                                               │           │
                                              ┌────────────────▼──┐  ┌────▼──────────────┐
                                              │     DynamoDB       │  │       SNS          │
                                              │  Guarda los leads  │  │  Email   │
                                              │  + Timestamp       │  └───────────────────┘
                                              └───────────────────┘
                                                        │
                                         ┌──────────────▼──────────────┐
                                         │        CloudWatch            │
                                         │  - Errores Lambda            │
                                         │  - Alarmas por email         │
                                         │  - Logs centralizados        │
                                         └─────────────────────────────┘
