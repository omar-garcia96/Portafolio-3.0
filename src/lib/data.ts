/* ============================================================
   data.ts
   Archivo único con:
     1. Interfaces TypeScript  (contratos de datos)
     2. Constantes del sitio   (todo el contenido editable)

   ¿Por qué centralizar aquí?
   → Para actualizar tu info solo editas este archivo,
     sin tocar ningún componente.
   ============================================================ */

// ─────────────────────────────────────────────────────────────
// 1. INTERFACES — definen la "forma" de cada objeto de datos
// ─────────────────────────────────────────────────────────────

/* Enlace de navegación */
export interface NavLink {
  label: string; // texto visible, ej: "SKILLS"
  href:  string; // ancla, ej: "#skills"
}

/* Una habilidad técnica individual */
export interface Skill {
  name:  string; // nombre, ej: "AWS"
  level: number; // porcentaje de dominio 0-100
}

/* Un grupo de habilidades (Cloud, DevOps, etc.) */
export interface SkillCategory {
  id:     string;  // identificador único, ej: "cloud"
  label:  string;  // título con corchetes, ej: "[CLOUD]"
  skills: Skill[];
}

/* Una entrada de experiencia laboral */
export interface Experience {
  id:          string;
  role:        string;   // cargo
  company:     string;   // empresa
  period:      string;   // ej: "2022 — Present"
  type:        "remote" | "onsite" | "hybrid";
  description: string[]; // lista de logros / responsabilidades
  tech:        string[]; // tecnologías usadas
}

/* Estudio formal */
export interface Education {
  id:          string;
  degree:      string;
  institution: string;
  period:      string;
  status:      "completed" | "in-progress";
}

/* Certificación profesional */
export interface Certification {
  id:     string;
  name:   string;  // nombre completo de la cert
  issuer: string;  // entidad emisora
  year:   string;
}

/* Proyecto del portfolio */
export interface Project {
  id:          string;
  title:       string;
  description: string;
  tech:        string[];
  repoUrl?:    string;  // opcional: link al repositorio
  demoUrl?:    string;  // opcional: link al demo en vivo
  status:      "active" | "in-progress" | "archived";
  highlights:  string[]; // puntos clave del proyecto
  slug: string; // para generar la URL del proyecto, ej: "/projects/mi-proyecto"
}

/* Datos del formulario de contacto */
export interface ContactForm {
  name:    string;
  email:   string;
  subject: string;
  message: string;
}

/* Respuesta genérica de la API (Lambda) */
export interface ApiResponse {
  success: boolean;
  message: string;
}

// ─────────────────────────────────────────────────────────────
// 2. CONSTANTES — todo el contenido del sitio en un lugar
// ─────────────────────────────────────────────────────────────

/* Metadatos generales del sitio
   → Actualiza esto con tu información real */
export const SITE = {
  name:        "Omar Garcia",
  handle:      "omar@portfolio.sys",       // aparece en el Navbar
  title:       "Ingeniero de Sistemas",
  subtitle:    "Especializado en Cloud Computing & Automatización.",
  description: "Construyendo soluciones eficientes, estables y seguras en entornos complejos.",
  email:       "omar@omargarcia.xyz",
  linkedin:    "https://www.linkedin.com/in/omar-alexis-garcia-galvis-6a187a330/",
  github:      "https://github.com/omar-garcia96",
  location:    "Colombia · Remote",
  // Datos de la barra de estado inferior
  ip:          "192.0.2.1",
  uptime:      "3+ years in Cloud & DevOps",
} as const;

/* Endpoint de API Gateway — se sobreescribe con la variable de entorno
   NEXT_PUBLIC_API_ENDPOINT definida en .env.local                     */
export const API_ENDPOINT =
  process.env.NEXT_PUBLIC_API_ENDPOINT ?? "https://api.omargarcia.xyz/contact";

/* ── Navegación ──────────────────────────────────────────── */
export const NAV_LINKS: NavLink[] = [
  { label: "ABOUT",      href: "#about"      },
  { label: "SKILLS",     href: "#skills"     },
  { label: "EXPERIENCE", href: "#experience" },
  { label: "EDUCATION",  href: "#education"  },
  { label: "PORTFOLIO",  href: "#portfolio"  },
  { label: "CONTACT",    href: "#contact"    },
];

/* ── Habilidades técnicas ────────────────────────────────── */
export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "cloud", label: "[CLOUD]",
    skills: [
      { name: "AWS",         level: 90 },
      { name: "S3",          level: 92 },
      { name: "Lambda",      level: 85 },
      { name: "CloudFront",  level: 85 },
      { name: "API Gateway", level: 80 },
    ],
  },
  {
    id: "devops", label: "[DEVOPS]",
    skills: [
      { name: "Terraform",       level: 88 },
      { name: "Docker",          level: 85 },
      { name: "Kubernetes",      level: 70 },
      { name: "GitHub Actions",  level: 80 },
      { name: "CI/CD Pipelines", level: 82 },
    ],
  },
  {
    id: "security", label: "[SECURITY]",
    skills: [
      { name: "IAM / Policies",       level: 85 },
      { name: "WAF / Shield",         level: 75 },
      { name: "VPN / VPC",            level: 80 },
    ],
  },
  {
    id: "dev", label: "[DEV]",
    skills: [
      { name: "C#",      level: 80 },
      { name: "Bash/Shell",  level: 80 },
      { name: "Next.js",     level: 60 },
      { name: "SQL",         level: 80 },
    ],
  },
];

/* ── Experiencia laboral ─────────────────────────────────── */
export const EXPERIENCES: Experience[] = [
  {
    id:      "exp-01",
    role:    "Cloud & DevOps Engineer",
    company: "Freelance / Remote",
    period:  "2024 — 2025",
    type:    "remote",
    description: [
      "Diseño de arquitecturas serverless y CDN utilizando AWS S3 y CloudFront",
      "Infraestructura como Código (IaC) modular y reproducible con Terraform.",
      "Automatización de pipelines CI/CD con GitHub Actions para despliegue de infraestructura y aplicaciones.",
      "Seguridad y endurecimiento de red mediante Origin Access Control (OAC), certificados SSL/TLS (ACM) y políticas de mínimo privilegio en IAM.",
    ],
    tech: ["AWS", "Terraform", "CDN", "SSL/TLS", "S3", "GitHub Actions", "CloudFront", "CI/CD", "Budgets"],
  },
  {
    id:      "exp-02",
    role:    "Ingeniero de Investigación y Desarrollo",
    company: "TNS S.A.S",
    period:  "2022 — 2023",
    type:    "onsite",
    description: [
      "Gestión y automatización de despliegues multi-entorno para garantizar alta disponibilidad y reducción de tiempos de entrega.",
      "Optimización de infraestructura en AWS mediante la implementación de mejores prácticas de seguridad y estabilidad.",
      "Monitoreo continuo de rendimiento para asegurar la operatividad y escalabilidad de los sistemas cloud.",
      "Administración de recursos cloud orientada al rendimiento, mejorando la eficiencia operativa de los servicios.",
    ],
    tech: ["AWS", "EC2", "RDS", "VPC", "S3", "CloudWatch", "MySQL", "GitHub", "Soporte Técnico"],
  },
  {
    id:      "exp-03",
    role:    "Tecnico de Investigación y Desarrollo",
    company: "TNS S.A.S",
    period:  "2021 — 2022",
    type:    "onsite",
    description: [
      "Validación y pruebas de integración en arquitecturas de microservicios para asegurar la estabilidad en entornos de producción.",
      "Pruebas de APIs y servicios web, garantizando la correcta comunicación y funcionamiento de los componentes del sistema.",
      "Desarrollo de herramientas internas de automatización para el procesamiento de datos y generación de reportes técnicos.",
      "Mejora de la eficiencia operativa, logrando una reducción del 50% en el tiempo dedicado a la revisión técnica manual.",
    ],
    tech: ["C#", "MySQL", "Automatización", "Pruebas de Integración", "Reportes CSV"],
  },
];

/* ── Educación formal ────────────────────────────────────── */
export const EDUCATIONS: Education[] = [
  {
    id:          "edu-01",
    degree:      "Ingeniería de Sistemas",
    institution: "Universidad de Pamplona",
    period:      "2015 — 2021",
    status:      "completed",
  },
];

/* ── Certificaciones ─────────────────────────────────────── */
export const CERTIFICATIONS: Certification[] = [
  { id: "c-01", name: "Curso Completo de AWS DevOps",                                   issuer: "Udemy",                   year: "2026" },
  { id: "c-02", name: "AWS Solutions Architect - Fundamentals of Architecting on AWS",  issuer: "AWS Skill Builder",       year: "2026" },
  { id: "c-03", name: "Shell Scripting en Linux",                                       issuer: "LinkedIn Learning",       year: "2026" },
  { id: "c-04", name: "Kubernetes",                                                     issuer: "Platzi",                  year: "2026" },
  { id: "c-05", name: "Intoducción a DevOps",                                           issuer: "Platzi",                  year: "2026" },
  { id: "c-06", name: "GitHub Actions",                                                 issuer: "Platzi",                  year: "2026" },
  { id: "c-07", name: "Fundamentos de AWS Cloud",                                       issuer: "Platzi",                  year: "2026" },
  { id: "c-08", name: "Terraform",                                                      issuer: "Platzi",                  year: "2026" },
  { id: "c-09", name: "Docker Avanzado",                                                issuer: "Platzi",                  year: "2026" },
  { id: "c-10", name: "Docker Fundamentos",                                             issuer: "Platzi",                  year: "2026" },
  { id: "c-11", name: "AWS Cloud Practitioner Essentials",                              issuer: "AWS Skill Builder",       year: "2026" },
  { id: "c-12", name: "Getting Started with DevOps on AWS",                             issuer: "AWS Skill Builder",       year: "2026" },
  { id: "c-13", name: "General English Course",                                         issuer: "Oxford House College",    year: "2024" },
];

/* ── Proyectos ───────────────────────────────────────────── */
export const PROJECTS: Project[] = [
  {
    id: "proj-01",
    slug: "portfolio-aws-devops",
    title: "Portfolio 3.0: Infraestructura 100% Serverless en AWS con AWS DevOps",
    description: "Diseñé e implementé la infraestructura completa de mi portfolio usando exclusivamente servicios administrados de AWS. Arquitectura serverless con CloudFront, S3, API Gateway, Lambda, DynamoDB, SNS y pipeline CI/CD nativo con CodeBuild y CodePipeline.",
   tech: ["AWS", "CloudFormation", "S3", "CloudFront", "API Gateway", "Lambda", "DynamoDB", "SNS", "CodeBuild", "CodePipeline", "Route53", "ACM"],
   repoUrl: "https://github.com/omar-garcia96/Portafolio-3.0",
   demoUrl: "https://omargarcia.xyz",
    status: "active",
   highlights: [
      "Infraestructura 100% serverless — sin servidores que administrar",
      "Pipeline CI/CD nativo AWS con CodeBuild + CodePipeline",
      "Backend de contacto con API Gateway → Lambda → DynamoDB → SNS",
   ],
  },
  {
    id:          "proj-02",
    slug: "pipeline-cicd", 
    title:       "Pipeline CI/CD End-to-End: IaC con Terraform + AWS EC2 + Cloudflare Zero Trust",
    description: "Diseñé una arquitectura de infraestructura como código (IaC) y automatización CI/CD para el despliegue de contenedores Docker en AWS, enfocada en la seguridad 'Zero Trust' y la eliminación de accesos manuales tradicionales.",
    tech: ["AWS", "S3", "EC2", "VPC", "ECR", "Lambda", "EventBridge", "CloudWatch", "IAM", "SNS", 
            "Docker", "GitHub Actions", "Terraform", "Cloudflare", "CI/CD", "SSL/TLS", "Zero Trust"],
    repoUrl:     "https://github.com/omar-garcia96/Proyecto-CV-2.0.git",
    demoUrl:     "https://omargarcia.xyz",
    status:      "archived",
    highlights: [
      "Infraestructura 100% como código con Terraform",
      "Pipeline CI/CD completamente automatizado con GitHub Actions",
      "Despliegue seguro sin puertos abiertos usando Cloudflare Zero Trust Tunnel",
    ],
  },
  {
    id:          "proj-03",
    slug: "aws-static-website",
    title:       "AWS Static Website Deployment (IaC + CI/CD)",
    description: "Diseñé una arquitectura serverless y altamente disponible en AWS para el despliegue de un sitio web estático, centrada en la automatización y la seguridad.",
    tech: ["AWS", "S3", "CloudFront", "CDN", "CI/CD", "GitHub Actions", "Terraform", "SSL/TLS", "Budgets"],
    repoUrl:     "https://github.com/omar-garcia96/HojadeVida-1.0.0.git",
    demoUrl:     "https://d1emj2ptwgcjc0.cloudfront.net/",
    status:      "active",
    highlights: [
      "Despliegue de sitio web estático con AWS S3 y CloudFront",
      "Automatización completa del despliegue con GitHub Actions",
      "Implementación de SSL/TLS para seguridad y reducción de latencia global",
    ],
  }
];
