# Portfolio 3.0 — Infraestructura 100% Serverless en AWS

> **Omar Alexis Garcia** · Cloud & DevOps Engineer · [omargarcia.xyz](https://omargarcia.xyz)

Portfolio profesional desplegado sobre una infraestructura completamente serverless en AWS, definida como código mediante CloudFormation y entregada automáticamente con un pipeline CI/CD nativo de AWS.

---

## Arquitectura

```
  Browser
    │
    ├──── GET omargarcia.xyz ────► Route53 ──► CloudFront ──► S3 (privado · OAC)
    │
    └──── POST /contact ─────────► API Gateway (HTTP API)
                                        │
                                        ▼
                                    Lambda (Node.js 22.x)
                                     │            │
                                     ▼            ▼
                                 DynamoDB        SNS
                               (mensajes)    (→ email)

  GitHub
    │
    └──── git push main ─────────► CodePipeline
                                        │
                                        ▼
                                    CodeBuild
                                  npm ci + build
                                        │
                              ┌─────────┴──────────┐
                              ▼                    ▼
                           S3 sync        CloudFront invalidation
```

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Infraestructura (IaC) | AWS CloudFormation — Nested Stacks |
| Frontend | Next.js 15 · TypeScript · Tailwind CSS |
| Hosting estático | Amazon S3 (privado) + CloudFront OAC |
| CDN | Amazon CloudFront — HTTP/3 · Brotli · Edge Caching |
| DNS | Amazon Route53 — Alias A/AAAA |
| SSL/TLS | AWS Certificate Manager (ACM) — auto-renovable |
| Backend | AWS Lambda — Node.js 22.x |
| API | Amazon API Gateway — HTTP API |
| Base de datos | Amazon DynamoDB — on-demand · TTL 1 año |
| Notificaciones | Amazon SNS — email |
| CI/CD | AWS CodePipeline + CodeBuild |

---

## Módulos CloudFormation (Nested Stacks)

```
infrastructure/
├── main.yaml               ← Orquestador principal
├── parameters/
│   └── prod.json           ← Parámetros de producción (gitignored)
└── modules/
    ├── s3.yaml             ← Website bucket + Artifacts bucket
    ├── cloudfront.yaml     ← Distribución CDN + OAC + Bucket Policy
    ├── route53.yaml        ← Records A/AAAA alias → CloudFront
    ├── dynamodb.yaml       ← Tabla de mensajes on-demand
    ├── sns.yaml            ← Topic + suscripción email
    ├── lambda.yaml         ← Función + IAM Role mínimo privilegio
    ├── api-gateway.yaml    ← HTTP API + ruta POST /contact + CORS
    └── cicd.yaml           ← CodePipeline + CodeBuild + IAM
```

**Orden de despliegue y dependencias:**
```
S3 → CloudFront → Route53
         DynamoDB ──┐
         SNS ───────┴─► Lambda → API Gateway
S3 + CloudFront ──────────────► CI/CD
```

---

## Flujo del Formulario de Contacto

```
1. Browser  ──POST /contact──►  API Gateway
2. API Gateway ──invoke──►  Lambda
3. Lambda valida campos (name, email, message)
4. Lambda ──PutItem──►  DynamoDB  (messageId UUID + timestamp + TTL)
5. Lambda ──Publish──►  SNS  (subject + body del mensaje)
6. SNS  ──email──►  alexisgalvis1996@gmail.com
7. Lambda  ──HTTP 200──►  Browser  { success: true, messageId }
```

---

## Decisiones de Seguridad

| Práctica | Implementación | Beneficio |
|---|---|---|
| Bucket privado | S3 Block Public Access + CloudFront OAC | Superficie de ataque cero |
| Sin credenciales hardcodeadas | IAM Roles + GitHub Secrets | Sin AWS keys expuestas |
| CORS estricto | API Gateway permite solo `omargarcia.xyz` | Evita llamadas no autorizadas |
| Cifrado en tránsito | ACM TLS 1.2/1.3 forzado en CloudFront | Todo el tráfico cifrado |
| Mínimo privilegio Lambda | `dynamodb:PutItem` + `sns:Publish` únicamente | Sin permisos innecesarios |
| Mínimo privilegio CodeBuild | `s3:sync` + `cloudfront:CreateInvalidation` | Sin AdministratorAccess |

---

## Pipeline CI/CD

```
git push main
      │
      ▼
CodePipeline detecta cambio (webhook via CodeStar Connection)
      │
      ▼
CodeBuild
  ├── npm ci
  ├── npm run build  (genera /out con HTML/CSS/JS estáticos)
  ├── aws s3 sync out/ s3://<bucket> --delete
  └── aws cloudfront create-invalidation --paths "/*"
      │
      ▼
Sitio actualizado globalmente en < 60 segundos
```

---

## Despliegue Manual

```bash
# 1. Subir módulos al bucket de templates
aws s3 sync infrastructure/modules/ s3://portafolio-3.0/modules/

# 2. Desplegar el stack principal
aws cloudformation deploy \
  --template-file infrastructure/main.yaml \
  --stack-name portfolio-prod \
  --parameter-overrides file://infrastructure/parameters/prod.json \
  --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
  --region us-east-1

# 3. Ver outputs (URL del sitio, endpoint del API, etc.)
aws cloudformation describe-stacks \
  --stack-name portfolio-prod \
  --query "Stacks[0].Outputs" \
  --output table
```

---

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Correr en modo desarrollo
npm run dev

# Generar build estático
npm run build
# → genera la carpeta out/ lista para subir a S3
```

Variables de entorno requeridas en `.env.local`:
```bash
NEXT_PUBLIC_API_ENDPOINT=https://<id>.execute-api.us-east-1.amazonaws.com/prod/contact
```

---

## Contacto

**Omar Alexis Garcia Galvis** · Cloud & DevOps Engineer

- 🌐 [omargarcia.xyz](https://omargarcia.xyz)
- 💼 [LinkedIn](https://www.linkedin.com/in/omar-alexis-garcia-galvis-6a187a330/)
- 🐙 [GitHub](https://github.com/omar-garcia96)