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
          "Este documento describe de forma detallada la arquitectura, decisiones técnicas y flujos de trabajo implementados en el proyecto de portfolio DevOps. El objetivo es que cualquier persona técnica pueda entender qué se construyó, cómo funciona cada componente y por qué se tomaron las decisiones de diseño.\n\nEl proyecto implementa una infraestructura completa en AWS siguiendo las mejores prácticas de la industria: Infraestructura como Código (IaC), contenedores Docker, pipelines CI/CD automatizados, exposición segura a internet sin abrir puertos, monitoreo proactivo y optimización automática de costos, todo completamente automatizado desde el primer commit hasta el portfolio visible en producción.",
      },
      {
        title: "02. Visión General de la Arquitectura",
        content:
          "La arquitectura se divide en cinco capas principales que trabajan en conjunto:",
        subsections: [
          {
            title: "Capa IaC",
            content:
              "Terraform aprovisiona toda la infraestructura en AWS de forma declarativa y reproducible.",
          },
          {
            title: "Capa CI/CD",
            content:
              "GitHub Actions automatiza el build, push y deploy en cada cambio de código.",
          },
          {
            title: "Capa de Aplicación",
            content:
              "Docker empaqueta la aplicación y Nginx la sirve dentro de la EC2.",
          },
          {
            title: "Capa de Seguridad",
            content:
              "Cloudflare Zero Trust Tunnel expone el portfolio sin abrir puertos en AWS.",
          },
          {
            title: "Capa de Monitoreo y Optimización de Costos",
            content:
              "AWS CloudWatch, SNS, Lambda y EventBridge trabajan en conjunto para vigilar la salud de la infraestructura, alertar sobre anomalías y apagar recursos automáticamente cuando no están en uso para ahorrar dinero.",
          },
        ],
      },
      {
        title: "03. Infraestructura como Código (Terraform)",
        content:
          "Terraform define toda la infraestructura en archivos .tf versionados junto al código. Esto garantiza que la infraestructura sea reproducible, auditable y fácil de modificar. El estado se almacena en Amazon S3 para que tanto el equipo local como GitHub Actions lean el mismo estado.",
        subsections: [
          {
            title: "Módulo Network",
            content:
              "Crea la red base: VPC (10.0.0.0/16) con 65,536 IPs, Subnet Pública (10.0.1.0/24) con 256 IPs, Internet Gateway para tráfico saliente y Route Table que enruta todo el tráfico externo (0.0.0.0/0) por el Internet Gateway.",
          },
          {
            title: "Módulo Security",
            content:
              "Security Group sin ninguna regla de entrada — ningún puerto está abierto al exterior. El tráfico web llega vía Cloudflare Tunnel (conexión saliente) y el deploy vía AWS SSM (no requiere puerto 22).\n\nIAM Role con mínimo privilegio: AmazonEC2ContainerRegistryReadOnly (solo lectura en ECR) y AmazonSSMManagedInstanceCore (comunicación con SSM sin SSH).",
          },
          {
            title: "Módulo Compute",
            content:
              "Amazon ECR: Registro privado de imágenes Docker. Cada imagen se almacena con el tag proyecto-cv-{SHA} (primeros 7 caracteres del commit) para trazabilidad completa y rollback.\n\nEC2: Instancia Ubuntu 24.04 t3.micro. Al arrancar, el User Data instala Docker, AWS CLI v2, SSM Agent y cloudflared, configurando el tunnel para enrutar omargarcia.xyz a localhost:80.",
          },
          {
            title: "Módulo de Observabilidad y Costos",
            content:
              "Implementa recursos para el ahorro financiero y el monitoreo de la salud del sistema:\n\nOptimización de Costos: Se configuró una función AWS Lambda programada para encender la EC2 a las 8:00 am y apagarla a las 6:00 pm de lunes a viernes. Esta función es disparada automáticamente mediante reglas cron configuradas en AWS EventBridge.\n\nMonitoreo y Alertas: Se implementó Amazon CloudWatch para vigilar la EC2, configurando las siguientes alarmas críticas:\n• CPU > 80% sostenido por 2 minutos.\n• StatusCheckFailed por 1 minuto (detecta si la EC2 se cae).\n• NetworkIn anómalamente alto por 2 minutos (posible saturación).\n\nEstas alarmas están conectadas a un tópico de AWS SNS que se encarga de enviar notificaciones por email de forma inmediata cuando un umbral crítico es superado.",
          },
        ],
      },
      {
        title: "04. Contenedores Docker",
        content:
          "La aplicación está empaquetada en una imagen Docker basada en nginx:stable-alpine. Alpine Linux (~5MB) reduce la superficie de ataque y el tamaño de la imagen final.\n\nBuenas prácticas implementadas:\n• Imagen base oficial con versión fija (stable)\n• COPY con --chown=nginx:nginx para que los archivos pertenezcan al usuario nginx\n• HEALTHCHECK cada 30 segundos vía curl\n• EXPOSE 80 documenta el puerto que usa el contenedor\n\nFormato de imágenes en ECR: <account_id>.dkr.ecr.us-east-1.amazonaws.com/portfolio-devops-aws:proyecto-cv-a1b2c3d",
      },
      {
        title: "05. Pipeline CI/CD (GitHub Actions)",
        content:
          "El ciclo de vida del desarrollo está completamente automatizado mediante dos workflows independientes.",
        subsections: [
          {
            title: "Workflow de Infraestructura (infra.yml)",
            content:
              "Se dispara únicamente cuando hay cambios en la carpeta infra/.\n\n• Pull Request a main → terraform plan (solo lectura) para revisar cambios antes de aprobar el PR\n• Push a main → terraform plan + terraform apply para desplegar automáticamente\n\nVariables sensibles se pasan como TF_VAR_* para que Terraform las lea sin hardcodear valores.",
          },
          {
            title: "Workflow de Aplicación (ci-cd.yml)",
            content:
              "Se dispara en cada push a main, excepto cambios solo en infra/. Pasos:\n\n1. Checkout del repositorio\n2. Set SHORT_SHA (primeros 7 chars del commit)\n3. Configure AWS credentials\n4. Login to Amazon ECR\n5. Build & Push imagen Docker con tag proyecto-cv-{SHORT_SHA}\n6. Deploy vía SSM: stop → rm → pull → run sin abrir el puerto 22",
          },
        ],
      },
      {
        title: "06. Exposición Segura — Cloudflare Zero Trust",
        content:
          "El portfolio se expone a internet sin abrir ningún puerto en AWS. A diferencia de un servidor tradicional, con Cloudflare Tunnel la EC2 actúa como cliente: es ella quien inicia la conexión hacia Cloudflare.",
        subsections: [
          {
            title: "Cómo funciona el túnel",
            content:
              "1. Al arrancar, cloudflared establece una conexión saliente persistente hacia Cloudflare por el puerto 443.\n2. Cloudflare registra esta conexión y sabe que la EC2 está disponible.\n3. Cuando un usuario visita omargarcia.xyz, el DNS apunta a Cloudflare (no a la EC2).\n4. Cloudflare Edge recibe el tráfico, aplica SSL y protección DDoS.\n5. Cloudflare inyecta el tráfico por el túnel hacia cloudflared en la EC2.\n6. cloudflared reenvía el tráfico a localhost:80 donde corre el contenedor con Nginx.",
          },
          {
            title: "Ventajas vs servidor tradicional",
            content:
              "• Puertos abiertos: Ninguno (vs 80/443 expuestos)\n• IP del servidor: Oculta detrás de Cloudflare (vs visible públicamente)\n• SSL: Automático con Let's Encrypt (vs configuración manual)\n• Protección DDoS: Incluida sin costo adicional\n• Quién inicia la conexión: La propia EC2 hacia Cloudflare",
          },
        ],
      },
      {
        title: "07. Decisiones de Seguridad",
        content:
          "El proyecto aplica el principio de mínimo privilegio en cada capa:\n\n• Sin puertos abiertos → Security Group sin reglas ingress → superficie de ataque cero\n• Sin SSH → Deploy vía AWS SSM Session Manager → no hay llaves privadas que gestionar\n• Sin credenciales en servidor → IAM Role con Instance Profile → no hay AWS keys hardcodeadas\n• Secrets cifrados → GitHub Secrets + Terraform sensitive → nunca aparecen en logs\n• IAM de mínimo privilegio → Policy personalizada para GitHub Actions → sin AdministratorAccess\n• Imágenes escaneadas → scan_on_push=true en ECR → detección automática de vulnerabilidades",
      },
      {
        title: "08. Stack Tecnológico",
        content:
          "• Terraform >= 1.5.0 → Aprovisionamiento de toda la infraestructura (IaC)\n• AWS EC2 t3.micro Ubuntu 24.04 → Servidor donde corre el contenedor Docker\n• Amazon ECR → Registro privado de imágenes Docker\n• Amazon S3 → Estado remoto de Terraform\n• AWS IAM → Identidad y permisos de la EC2 y GitHub Actions\n• AWS SSM Session Manager → Deploy remoto sin SSH ni puertos abiertos\n• Docker nginx:stable-alpine → Contenedor de la aplicación\n• GitHub Actions → CI/CD automatizado (build, push, deploy)\n• Cloudflare Zero Trust Tunnel → Exposición segura sin puertos abiertos\n• AWS Lambda → Función serverless para automatizar el encendido y apagado de la EC2 (FinOps)\n• AWS EventBridge → Programación de eventos (cron) para disparar la función Lambda\n• Amazon CloudWatch → Monitoreo de recursos y configuración de alarmas críticas (CPU, Status, Red)\n• Amazon SNS → Servicio de notificaciones (email) integrado con CloudWatch para alertas en tiempo real",
      },
      {
        title: "09. Despliegue Manual",
        content:
          "Si se requiere recrear la infraestructura desde cero sin GitHub Actions:\n\n# 1. Inicializar Terraform y configurar backend S3\nterraform init\n\n# 2. Generar el plan de ejecución\nterraform plan -out=plan.out\n\n# 3. Aplicar la infraestructura\nterraform apply plan.out\n\n# 4. Recrear solo la EC2 sin tocar VPC ni ECR\nterraform apply -replace=\"module.compute.aws_instance.app_server\"",
      },
      
    ],
    repoUrl: "https://github.com",
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
        content:
          "Este documento describe la arquitectura, decisiones técnicas y flujos de trabajo implementados en el proyecto de despliegue de un sitio web estático serverless.\n\nEl proyecto implementa una infraestructura completa en AWS siguiendo las mejores prácticas: Infraestructura como Código (IaC), entrega de contenido global mediante CDN, pipelines CI/CD automatizados y políticas estrictas de seguridad.",
      },
      {
        title: "02. Visión General de la Arquitectura",
        content:
          "La arquitectura se divide en cuatro capas principales:",
        subsections: [
          {
            title: "Capa IaC",
            content:
              "Terraform aprovisiona toda la infraestructura en AWS de forma declarativa y reproducible.",
          },
          {
            title: "Capa CI/CD",
            content:
              "GitHub Actions automatiza el build, sync y deploy en cada cambio de código.",
          },
          {
            title: "Capa de Almacenamiento",
            content:
              "Amazon S3 actúa como el origen privado de los datos (archivos HTML, CSS, JS).",
          },
          {
            title: "Capa de Entrega y Seguridad",
            content:
              "Amazon CloudFront sirve el contenido globalmente mediante Edge Locations, forzando HTTPS y restringiendo el acceso directo al origen.",
          },
        ],
      },
      {
        title: "03. Infraestructura como Código (Terraform)",
        content:
          "Terraform define toda la infraestructura en archivos .tf versionados. El estado se almacena en Amazon S3 para consistencia entre entorno local y GitHub Actions.",
        subsections: [
          {
            title: "Módulo Storage (Amazon S3)",
            content:
              "Bucket Privado: Block Public Access activado en su totalidad. No existe acceso público desde internet.\n\nBucket Policy restrictiva que solo permite s3:GetObject si la petición proviene explícitamente del ARN de la distribución de CloudFront (condición aws:SourceArn).",
          },
          {
            title: "Módulo CDN (CloudFront)",
            content:
              "• Edge Caching: Reduce drásticamente la latencia global cacheando activos estáticos en servidores cercanos al usuario.\n• Origin Access Control (OAC): Mecanismo moderno para autenticar peticiones desde CloudFront hacia S3, manteniendo el origen invisible para internet.\n• Viewer Protocol Policy: redirect-to-https para asegurar el cifrado en tránsito.",
          },
          {
            title: "Módulo Security (IAM)",
            content:
              "Policy personalizada para GitHub Actions con permisos mínimos: solo s3:PutObject, s3:ListBucket y cloudfront:CreateInvalidation. Sin AdministratorAccess.",
          },
        ],
      },
      {
        title: "04. Decisiones de Seguridad",
        content:
          "El proyecto aplica el principio de mínimo privilegio en cada capa:\n\n• Origen Oculto → S3 Block Public Access + CloudFront OAC → superficie de ataque cero en el backend\n• Cifrado en tránsito → CloudFront con AWS Certificate Manager (ACM) → todo el tráfico es HTTPS\n• IAM de mínimo privilegio → Policy personalizada → sin AdministratorAccess\n• Secrets cifrados → GitHub Secrets + Terraform sensitive → nunca aparecen en logs",
      },
      {
        title: "05. Pipeline CI/CD (GitHub Actions)",
        content:
          "Dos workflows independientes con responsabilidad clara.",
        subsections: [
          {
            title: "Workflow de Infraestructura (infra.yml)",
            content:
              "• Pull Request a main → terraform plan (solo lectura)\n• Push a main → terraform plan + terraform apply automáticamente",
          },
          {
            title: "Workflow de Aplicación (deploy.yml)",
            content:
              "1. Checkout del repositorio\n2. Configure AWS credentials\n3. Sync a S3 → sincroniza solo los archivos modificados con aws s3 sync\n4. Invalidación de Caché → aws cloudfront create-invalidation para purgar la caché antigua y servir la versión recién desplegada",
          },
        ],
      },
      {
        title: "06. Flujo Completo End-to-End",
        content:
          "1. El desarrollador hace git push a main con cambios en la aplicación.\n2. GitHub Actions dispara el workflow de despliegue automáticamente.\n3. Se autentica en AWS de manera segura.\n4. Sincroniza eficientemente solo los archivos modificados hacia Amazon S3.\n5. Lanza una orden de invalidación a CloudFront.\n6. El usuario visita el dominio y ve la versión actualizada en segundos, servida desde su Edge Location más cercana.",
      },
      {
        title: "07. Stack Tecnológico",
        content:
          "• Terraform >= 1.5.0 → Aprovisionamiento de toda la infraestructura (IaC)\n• Amazon S3 → Origen de los archivos estáticos y estado remoto de Terraform\n• Amazon CloudFront → CDN, Edge Caching, OAC y enrutamiento HTTPS\n• AWS IAM → Identidad y permisos granulares de integración continua\n• GitHub Actions → CI/CD automatizado (sync, invalidation)",
      },
      {
        title: "08. Despliegue Manual",
        content:
          "# 1. Inicializar Terraform y configurar backend S3\nterraform init\n\n# 2. Generar el plan de ejecución\nterraform plan -out=plan.out\n\n# 3. Aplicar la infraestructura\nterraform apply plan.out\n\n# 4. Desplegar aplicación e invalidar caché\naws s3 sync ./src s3://<bucket> --delete\naws cloudfront create-invalidation --distribution-id <ID> --paths \"/*\"",
      },
    ],
    repoUrl: "https://github.com",
    demoUrl: "https://d1emj2ptwgcjc0.cloudfront.net/",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
