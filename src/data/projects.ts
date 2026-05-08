export type Section = {
  title: string;
  content: string;
  subsections?: { title: string; content: string }[];
};

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  status: "ACTIVE" | "ARCHIVED";
  description: string;
  tags: string[];
  highlights: string[];
  sections: Section[];
  repoUrl?: string;
  demoUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "pipeline-cicd",
    title: "Pipeline CI/CD End-to-End: IaC con Terraform + AWS EC2 + Cloudflare Zero Trust",
    subtitle: "De Código a Producción",
    status: "ACTIVE",
    description:
      "Diseñé una arquitectura de infraestructura como código (IaC) y automatización CI/CD para el despliegue de contenedores Docker en AWS, enfocada en la seguridad 'Zero Trust' y la eliminación de accesos manuales tradicionales.",
    highlights: [
      "Infraestructura 100% como código con Terraform",
      "Pipeline CI/CD completamente automatizado con GitHub Actions",
      "Despliegue seguro sin puertos abiertos usando Cloudflare Zero Trust Tunnel",
    ],
    tags: [
      "AWS", "S3", "EC2", "VPC", "ECR", "Lambda", "EventBridge",
      "CloudWatch", "IAM", "SNS", "Docker", "GitHub Actions",
      "Terraform", "Cloudflare", "CI/CD", "SSL/TLS", "Zero Trust",
    ],
    sections: [
      {
        title: "01. Introducción",
        content:
          "Este documento describe de forma detallada la arquitectura, decisiones técnicas y flujos de trabajo implementados en el proyecto de portfolio DevOps. El objetivo es que cualquier persona técnica pueda entender qué se construyó, cómo funciona cada componente y por qué se tomaron las decisiones de diseño.\n\nEl proyecto implementa una infraestructura completa en AWS siguiendo las mejores prácticas de la industria: Infraestructura como Código (IaC), contenedores Docker, pipelines CI/CD automatizados y exposición segura a internet sin abrir puertos, todo completamente automatizado desde el primer commit hasta el portfolio visible en producción.",
      },
      {
        title: "02. Visión General de la Arquitectura",
        content: "La arquitectura se divide en cuatro capas principales que trabajan en conjunto:",
        subsections: [
          { title: "Capa IaC", content: "Terraform aprovisiona toda la infraestructura en AWS de forma declarativa y reproducible." },
          { title: "Capa CI/CD", content: "GitHub Actions automatiza el build, push y deploy en cada cambio de código." },
          { title: "Capa de Aplicación", content: "Docker empaqueta la aplicación y Nginx la sirve dentro de la EC2." },
          { title: "Capa de Seguridad", content: "Cloudflare Zero Trust Tunnel expone el portfolio sin abrir puertos en AWS." },
        ],
      },
      {
        title: "03. Infraestructura como Código (Terraform)",
        content: "Terraform define toda la infraestructura en archivos .tf versionados junto al código. El estado se almacena en Amazon S3 para que tanto el equipo local como GitHub Actions lean el mismo estado.",
        subsections: [
          { title: "Módulo Network", content: "Crea la red base: VPC (10.0.0.0/16) con 65,536 IPs, Subnet Pública (10.0.1.0/24) con 256 IPs, Internet Gateway para tráfico saliente y Route Table que enruta todo el tráfico externo (0.0.0.0/0) por el Internet Gateway." },
          { title: "Módulo Security", content: "Security Group sin ninguna regla de entrada — ningún puerto está abierto al exterior. El tráfico web llega vía Cloudflare Tunnel (conexión saliente) y el deploy vía AWS SSM (no requiere puerto 22).\n\nIAM Role con mínimo privilegio: AmazonEC2ContainerRegistryReadOnly (solo lectura en ECR) y AmazonSSMManagedInstanceCore (comunicación con SSM sin SSH)." },
          { title: "Módulo Compute", content: "Amazon ECR: Registro privado de imágenes Docker. Cada imagen se almacena con el tag proyecto-cv-{SHA} para trazabilidad completa y rollback.\n\nEC2: Instancia Ubuntu 24.04 t3.micro. Al arrancar, el User Data instala Docker, AWS CLI v2, SSM Agent y cloudflared, configurando el tunnel para enrutar omargarcia.xyz a localhost:80." },
        ],
      },
      {
        title: "04. Contenedores Docker",
        content: "La aplicación está empaquetada en una imagen Docker basada en nginx:stable-alpine. Alpine Linux (~5MB) reduce la superficie de ataque y el tamaño de la imagen final.\n\nBuenas prácticas implementadas:\n• Imagen base oficial con versión fija (stable)\n• COPY con --chown=nginx:nginx para que los archivos pertenezcan al usuario nginx\n• HEALTHCHECK cada 30 segundos vía curl\n• EXPOSE 80 documenta el puerto que usa el contenedor",
      },
      {
        title: "05. Pipeline CI/CD (GitHub Actions)",
        content: "El ciclo de vida del desarrollo está completamente automatizado mediante dos workflows independientes.",
        subsections: [
          { title: "Workflow de Infraestructura (infra.yml)", content: "Se dispara únicamente cuando hay cambios en la carpeta infra/.\n\n• Pull Request a main → terraform plan (solo lectura)\n• Push a main → terraform plan + terraform apply\n\nVariables sensibles se pasan como TF_VAR_* para que Terraform las lea sin hardcodear valores." },
          { title: "Workflow de Aplicación (ci-cd.yml)", content: "Se dispara en cada push a main, excepto cambios solo en infra/. Pasos:\n\n1. Checkout del repositorio\n2. Set SHORT_SHA (primeros 7 chars del commit)\n3. Configure AWS credentials\n4. Login to Amazon ECR\n5. Build & Push imagen Docker con tag proyecto-cv-{SHORT_SHA}\n6. Deploy vía SSM: stop → rm → pull → run sin abrir el puerto 22" },
        ],
      },
      {
        title: "06. Exposición Segura — Cloudflare Zero Trust",
        content: "El portfolio se expone a internet sin abrir ningún puerto en AWS. Con Cloudflare Tunnel la EC2 actúa como cliente: es ella quien inicia la conexión hacia Cloudflare.",
        subsections: [
          { title: "Cómo funciona el túnel", content: "1. cloudflared establece una conexión saliente persistente hacia Cloudflare por el puerto 443.\n2. Cloudflare registra la conexión y sabe que la EC2 está disponible.\n3. Cuando un usuario visita omargarcia.xyz, el DNS apunta a Cloudflare (no a la EC2).\n4. Cloudflare Edge recibe el tráfico, aplica SSL y protección DDoS.\n5. cloudflared reenvía el tráfico a localhost:80 donde corre el contenedor con Nginx." },
          { title: "Ventajas vs servidor tradicional", content: "• Puertos abiertos: Ninguno (vs 80/443 expuestos)\n• IP del servidor: Oculta detrás de Cloudflare\n• SSL: Automático con Let's Encrypt\n• Protección DDoS: Incluida sin costo adicional" },
        ],
      },
      {
        title: "07. Decisiones de Seguridad",
        content: "El proyecto aplica el principio de mínimo privilegio en cada capa:\n\n• Sin puertos abiertos → Security Group sin reglas ingress → superficie de ataque cero\n• Sin SSH → Deploy vía AWS SSM Session Manager → no hay llaves privadas que gestionar\n• Sin credenciales en servidor → IAM Role con Instance Profile → no hay AWS keys hardcodeadas\n• Secrets cifrados → GitHub Secrets + Terraform sensitive → nunca aparecen en logs\n• IAM de mínimo privilegio → Policy personalizada para GitHub Actions → sin AdministratorAccess\n• Imágenes escaneadas → scan_on_push=true en ECR → detección automática de vulnerabilidades",
      },
      {
        title: "08. Stack Tecnológico",
        content: "• Terraform >= 1.5.0 → Aprovisionamiento de toda la infraestructura (IaC)\n• AWS EC2 t3.micro Ubuntu 24.04 → Servidor donde corre el contenedor Docker\n• Amazon ECR → Registro privado de imágenes Docker\n• Amazon S3 → Estado remoto de Terraform\n• AWS IAM → Identidad y permisos de la EC2 y GitHub Actions\n• AWS SSM Session Manager → Deploy remoto sin SSH ni puertos abiertos\n• Docker nginx:stable-alpine → Contenedor de la aplicación\n• GitHub Actions → CI/CD automatizado (build, push, deploy)\n• Cloudflare Zero Trust Tunnel → Exposición segura sin puertos abiertos",
      },
      {
        title: "09. Despliegue Manual",
        content: "# 1. Inicializar Terraform y configurar backend S3\nterraform init\n\n# 2. Generar el plan de ejecución\nterraform plan -out=plan.out\n\n# 3. Aplicar la infraestructura\nterraform apply plan.out\n\n# 4. Recrear solo la EC2 sin tocar VPC ni ECR\nterraform apply -replace=\"module.compute.aws_instance.app_server\"",
      },
    ],
    repoUrl: "https://github.com/omar-garcia96/Proyecto-CV-2.0.git",
    demoUrl: "https://omargarcia.xyz",
  },
  {
    slug: "aws-static-website",
    title: "AWS Static Website Deployment (IaC + CI/CD)",
    subtitle: "Serverless Architecture",
    status: "ACTIVE",
    description:
      "Diseñé una arquitectura serverless y altamente disponible en AWS para el despliegue de un sitio web estático, centrada en la automatización y la seguridad.",
    highlights: [
      "Despliegue de sitio web estático con AWS S3 y CloudFront",
      "Automatización completa del despliegue con GitHub Actions",
      "Implementación de SSL/TLS para seguridad y reducción de latencia global",
    ],
    tags: [
      "AWS", "S3", "CloudFront", "CDN", "CI/CD",
      "GitHub Actions", "Terraform", "SSL/TLS", "Budgets",
    ],
    sections: [
      {
        title: "01. Introducción",
        content: "Este documento describe la arquitectura, decisiones técnicas y flujos de trabajo implementados en el proyecto de despliegue de un sitio web estático serverless.\n\nEl proyecto implementa una infraestructura completa en AWS siguiendo las mejores prácticas: Infraestructura como Código (IaC), entrega de contenido global mediante CDN, pipelines CI/CD automatizados y políticas estrictas de seguridad.",
      },
      {
        title: "02. Visión General de la Arquitectura",
        content: "La arquitectura se divide en cuatro capas principales:",
        subsections: [
          { title: "Capa IaC", content: "Terraform aprovisiona toda la infraestructura en AWS de forma declarativa y reproducible." },
          { title: "Capa CI/CD", content: "GitHub Actions automatiza el build, sync y deploy en cada cambio de código." },
          { title: "Capa de Almacenamiento", content: "Amazon S3 actúa como el origen privado de los datos (archivos HTML, CSS, JS)." },
          { title: "Capa de Entrega y Seguridad", content: "Amazon CloudFront sirve el contenido globalmente mediante Edge Locations, forzando HTTPS y restringiendo el acceso directo al origen." },
        ],
      },
      {
        title: "03. Infraestructura como Código (Terraform)",
        content: "Terraform define toda la infraestructura en archivos .tf versionados. El estado se almacena en Amazon S3 para consistencia entre entorno local y GitHub Actions.",
        subsections: [
          { title: "Módulo Storage (Amazon S3)", content: "Bucket Privado: Block Public Access activado en su totalidad. No existe acceso público desde internet.\n\nBucket Policy restrictiva que solo permite s3:GetObject si la petición proviene explícitamente del ARN de la distribución de CloudFront (condición aws:SourceArn)." },
          { title: "Módulo CDN (CloudFront)", content: "• Edge Caching: Reduce drásticamente la latencia global cacheando activos estáticos en servidores cercanos al usuario.\n• Origin Access Control (OAC): Mecanismo moderno para autenticar peticiones desde CloudFront hacia S3.\n• Viewer Protocol Policy: redirect-to-https para asegurar el cifrado en tránsito." },
          { title: "Módulo Security (IAM)", content: "Policy personalizada para GitHub Actions con permisos mínimos: solo s3:PutObject, s3:ListBucket y cloudfront:CreateInvalidation. Sin AdministratorAccess." },
        ],
      },
      {
        title: "04. Decisiones de Seguridad",
        content: "El proyecto aplica el principio de mínimo privilegio en cada capa:\n\n• Origen Oculto → S3 Block Public Access + CloudFront OAC → superficie de ataque cero\n• Cifrado en tránsito → CloudFront con AWS Certificate Manager (ACM) → todo el tráfico es HTTPS\n• IAM de mínimo privilegio → Policy personalizada → sin AdministratorAccess\n• Secrets cifrados → GitHub Secrets + Terraform sensitive → nunca aparecen en logs",
      },
      {
        title: "05. Pipeline CI/CD (GitHub Actions)",
        content: "Dos workflows independientes con responsabilidad clara.",
        subsections: [
          { title: "Workflow de Infraestructura (infra.yml)", content: "• Pull Request a main → terraform plan (solo lectura)\n• Push a main → terraform plan + terraform apply automáticamente" },
          { title: "Workflow de Aplicación (deploy.yml)", content: "1. Checkout del repositorio\n2. Configure AWS credentials\n3. Sync a S3 → sincroniza solo los archivos modificados con aws s3 sync\n4. Invalidación de Caché → aws cloudfront create-invalidation para purgar la caché antigua" },
        ],
      },
      {
        title: "06. Flujo Completo End-to-End",
        content: "1. El desarrollador hace git push a main con cambios en la aplicación.\n2. GitHub Actions dispara el workflow de despliegue automáticamente.\n3. Se autentica en AWS de manera segura.\n4. Sincroniza eficientemente solo los archivos modificados hacia Amazon S3.\n5. Lanza una orden de invalidación a CloudFront.\n6. El usuario visita el dominio y ve la versión actualizada en segundos.",
      },
      {
        title: "07. Stack Tecnológico",
        content: "• Terraform >= 1.5.0 → Aprovisionamiento de toda la infraestructura (IaC)\n• Amazon S3 → Origen de los archivos estáticos y estado remoto de Terraform\n• Amazon CloudFront → CDN, Edge Caching, OAC y enrutamiento HTTPS\n• AWS IAM → Identidad y permisos granulares de integración continua\n• GitHub Actions → CI/CD automatizado (sync, invalidation)",
      },
      {
        title: "08. Despliegue Manual",
        content: "# 1. Inicializar Terraform y configurar backend S3\nterraform init\n\n# 2. Generar el plan de ejecución\nterraform plan -out=plan.out\n\n# 3. Aplicar la infraestructura\nterraform apply plan.out\n\n# 4. Desplegar aplicación e invalidar caché\naws s3 sync ./src s3://<bucket> --delete\naws cloudfront create-invalidation --distribution-id <ID> --paths \"/*\"",
      },
    ],
    repoUrl: "https://github.com/omar-garcia96/HojadeVida-1.0.0.git",
    demoUrl: "https://d1emj2ptwgcjc0.cloudfront.net/",
  },
  // ── Proyecto 3 — Portfolio 3.0 con infraestructura 100% AWS ──
  {
    slug: "portfolio-aws-devops",
    title: "Portfolio 3.0: Infraestructura 100% Serverless en AWS con AWS DevOps",
    subtitle: "AWS DevOps · CloudFormation · Serverless",
    status: "ACTIVE",
    description:
      "Diseñé e implementé la infraestructura completa de mi portfolio personal usando exclusivamente servicios administrados de AWS. Arquitectura serverless con entrega global via CloudFront, backend de contacto con API Gateway + Lambda + DynamoDB + SNS, y pipeline CI/CD nativo de AWS con CodeBuild y CodePipeline.",
    highlights: [
      "Infraestructura 100% serverless — sin servidores que administrar",
      "Pipeline CI/CD nativo AWS con CodeBuild + CodePipeline",
      "Backend de contacto con API Gateway → Lambda → DynamoDB → SNS",
    ],
    tags: [
      "AWS", "CloudFormation", "S3", "CloudFront", "Route53",
      "API Gateway", "Lambda", "DynamoDB", "SNS", "CodeBuild",
      "CodePipeline", "ACM", "IAM", "CDN", "Serverless", "IaC",
    ],
    sections: [
      {
        title: "01. Introducción",
        content:
          "Este documento describe la arquitectura, decisiones técnicas y flujos de trabajo implementados en la infraestructura del portfolio personal versión 3.0.\n\nEl objetivo fue construir una plataforma completamente serverless en AWS, eliminando la gestión de servidores y aprovechando al máximo los servicios administrados. Toda la infraestructura está definida como código mediante AWS CloudFormation, garantizando reproducibilidad y control total sobre los recursos.",
      },
      {
        title: "02. Visión General de la Arquitectura",
        content: "La arquitectura se divide en cinco capas principales que trabajan en conjunto:",
        subsections: [
          {
            title: "Capa de Hosting Estático",
            content: "Amazon S3 almacena los archivos compilados del sitio (HTML, CSS, JS) de forma privada. Ningún usuario puede acceder directamente al bucket — solo CloudFront tiene permiso via Origin Access Control (OAC).",
          },
          {
            title: "Capa de Entrega de Contenido",
            content: "Amazon CloudFront distribuye el contenido globalmente desde Edge Locations. Fuerza HTTPS, comprime los archivos automáticamente y cachea los assets estáticos para máxima velocidad.",
          },
          {
            title: "Capa DNS",
            content: "Amazon Route53 resuelve el dominio omargarcia.xyz apuntando a CloudFront mediante Alias records, con soporte IPv4 e IPv6.",
          },
          {
            title: "Capa de Backend Serverless",
            content: "El formulario de contacto se conecta a API Gateway (HTTP API) que invoca una función Lambda. La Lambda guarda el mensaje en DynamoDB y publica una notificación en SNS que envía un email al propietario.",
          },
          {
            title: "Capa CI/CD Nativa AWS",
            content: "CodePipeline orquesta el pipeline. CodeBuild ejecuta npm install, npm run build, sube los archivos a S3 con aws s3 sync y crea una invalidación en CloudFront para que los cambios sean visibles de inmediato.",
          },
        ],
      },
      {
        title: "03. Infraestructura como Código (CloudFormation)",
        content: "Toda la infraestructura está definida en archivos YAML de AWS CloudFormation organizados en módulos (nested stacks). El stack principal orquesta cada módulo en el orden correcto respetando las dependencias entre servicios.",
        subsections: [
          {
            title: "Módulo S3",
            content: "Crea dos buckets:\n• Website bucket: almacena los archivos del sitio. Block Public Access activado — solo CloudFront puede leer via OAC. Versionado habilitado para rollback.\n• Artifacts bucket: almacena los artefactos intermedios de CodePipeline entre etapas. Lifecycle rule elimina artefactos después de 30 días.",
          },
          {
            title: "Módulo CloudFront",
            content: "Crea el Origin Access Control (OAC) y la distribución CloudFront con:\n• Dominio personalizado omargarcia.xyz con certificado ACM\n• HTTP/2 y HTTP/3 activados\n• Compresión automática gzip/brotli\n• Redirect HTTP → HTTPS\n• Custom error responses para routing SPA",
          },
          {
            title: "Módulo Route53",
            content: "Crea Alias records tipo A y AAAA (IPv6) apuntando el dominio raíz y www.omargarcia.xyz hacia CloudFront. Se usan Alias en lugar de CNAME porque funcionan en el apex del dominio sin costo adicional.",
          },
          {
            title: "Módulo DynamoDB",
            content: "Tabla portfolio-contact-messages-prod con:\n• Partition Key: messageId (UUID generado por Lambda)\n• Sort Key: timestamp (ISO 8601)\n• Billing: PAY_PER_REQUEST (on-demand) — sin capacidad reservada\n• Point-in-Time Recovery activado\n• TTL de 1 año para limpieza automática",
          },
          {
            title: "Módulo SNS",
            content: "Topic Standard con suscripción de email para recibir notificaciones cuando un usuario envía un mensaje desde el formulario de contacto. La suscripción requiere confirmación via email antes de activarse.",
          },
          {
            title: "Módulo Lambda",
            content: "Función Node.js 22.x que recibe el POST del formulario, valida los campos, guarda el registro en DynamoDB y publica la notificación en SNS.\n\nIAM con mínimo privilegio:\n• dynamodb:PutItem → solo en la tabla de mensajes\n• sns:Publish → solo en el topic de notificaciones\n• logs:* → solo en su propio log group",
          },
          {
            title: "Módulo API Gateway",
            content: "HTTP API (más económica y rápida que REST API) con:\n• Ruta POST /contact integrada con Lambda (proxy integration)\n• CORS configurado para omargarcia.xyz\n• Auto-deploy activado en el stage prod",
          },
          {
            title: "Módulo CI/CD (CodePipeline + CodeBuild)",
            content: "CodePipeline con tres etapas:\n1. Source → detecta cambios en GitHub via CodeStar Connection\n2. Build → CodeBuild ejecuta: npm ci → npm run build → aws s3 sync → cloudfront create-invalidation\n3. Sin etapa Deploy separada — el deploy ocurre dentro del buildspec\n\nCodeBuild corre en contenedor Amazon Linux con Node.js 20, 2 vCPUs y 4GB RAM.",
          },
        ],
      },
      {
        title: "04. Flujo del Formulario de Contacto",
        content: "El formulario de contacto implementa un flujo serverless completo:\n\n1. Usuario llena el formulario en omargarcia.xyz\n2. Next.js hace POST a API Gateway (HTTP API)\n3. API Gateway invoca la función Lambda\n4. Lambda valida name, email y message\n5. Lambda guarda el registro en DynamoDB con UUID + timestamp\n6. Lambda publica en SNS con el contenido del mensaje\n7. SNS envía el email a alexisgalvis1996@gmail.com\n8. Lambda retorna HTTP 200 con el messageId\n9. El frontend muestra confirmación en el panel de logs",
      },
      {
        title: "05. Flujo CI/CD End-to-End",
        content: "1. Developer hace git push a main en GitHub\n2. CodePipeline detecta el cambio via webhook (CodeStar Connection)\n3. CodeBuild descarga el código fuente\n4. npm ci instala las dependencias exactas del package-lock.json\n5. npm run build genera la carpeta out/ con los archivos estáticos\n6. aws s3 sync out/ sincroniza solo los archivos modificados al bucket\n7. cloudfront create-invalidation /* invalida la caché\n8. El usuario ve los cambios en segundos",
      },
      {
        title: "06. Decisiones de Seguridad",
        content: "El proyecto aplica el principio de mínimo privilegio en cada capa:\n\n• S3 privado + OAC → solo CloudFront puede leer los archivos del sitio\n• API Gateway CORS → solo omargarcia.xyz puede hacer requests al backend\n• Lambda IAM mínimo → solo PutItem en DynamoDB y Publish en SNS\n• CodeBuild IAM mínimo → solo s3:sync y cloudfront:CreateInvalidation\n• Certificado ACM → todo el tráfico forzado a HTTPS\n• Variables de entorno en CodeBuild → sin secretos hardcodeados en el código",
      },
      {
        title: "07. Stack Tecnológico",
        content: "• AWS CloudFormation → IaC modular con nested stacks\n• Amazon S3 → Hosting estático privado + artefactos CI/CD\n• Amazon CloudFront → CDN global con OAC, HTTP/3 y compresión\n• Amazon Route53 → DNS con Alias records IPv4/IPv6\n• AWS Certificate Manager → SSL/TLS gratuito y auto-renovable\n• Amazon API Gateway (HTTP API) → Endpoint serverless del formulario\n• AWS Lambda (Node.js 22.x) → Lógica del formulario de contacto\n• Amazon DynamoDB → Almacenamiento de mensajes (on-demand)\n• Amazon SNS → Notificaciones por email\n• AWS CodePipeline → Orquestación del pipeline CI/CD\n• AWS CodeBuild → Build y deploy del sitio\n• Next.js 15 → Framework del frontend (export estático)\n• Tailwind CSS → Estilos del portfolio",
      },
      {
        title: "08. Despliegue Manual",
        content: "# 1. Subir módulos al bucket de templates\naws s3 sync infrastructure/modules/ s3://portafolio-3.0/modules/\n\n# 2. Desplegar el stack principal\naws cloudformation deploy \\\n  --template-file infrastructure/main.yaml \\\n  --stack-name portfolio-prod \\\n  --parameter-overrides file://infrastructure/parameters/prod.json \\\n  --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \\\n  --region us-east-1\n\n# 3. Ver outputs del stack\naws cloudformation describe-stacks \\\n  --stack-name portfolio-prod \\\n  --query 'Stacks[0].Outputs'",
      },
    ],
    repoUrl: "https://github.com/omar-garcia96/Portafolio-3.0",
    demoUrl: "https://omargarcia.xyz",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}