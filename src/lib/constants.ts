import type {
  NavLink,
  SkillCategory,
  Experience,
  Education,
  Certification,
  Project,
} from "./types";

// ─── Site metadata ────────────────────────────────────────────
export const SITE_META = {
  name:        "Omar Garcia",
  handle:      "omar@portfolio.sys",
  title:       "Ingeniero de Sistemas",
  subtitle:    "Especializado en Cloud Computing & Automatización.",
  description: "Construyendo soluciones eficientes, estables y seguras en entornos complejos.",
  email:       "omar@omargarcia.xyz",
  linkedin:    "https://www.linkedin.com/in/omar-alexis-garcia-galvis-6a187a330/",
  github:      "https://github.com/omargarcia",
  location:    "Colombia · Remote",
  ip:          "192.0.2.1",
  uptime:      "3+ years in Cloud & DevOps",
};

// ─── Navigation ────────────────────────────────────────────────
export const NAV_LINKS: NavLink[] = [
  { label: "ABOUT",      href: "#about" },
  { label: "SKILLS",     href: "#skills" },
  { label: "EXPERIENCE", href: "#experience" },
  { label: "EDUCATION",  href: "#education" },
  { label: "PORTFOLIO",  href: "#portfolio" },
  { label: "CONTACT",    href: "#contact" },
];

// ─── Skills ────────────────────────────────────────────────────
export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "cloud",
    label: "[CLOUD]",
    skills: [
      { name: "AWS",        level: 90, category: "cloud" },
      { name: "CloudFront", level: 85, category: "cloud" },
      { name: "S3",         level: 90, category: "cloud" },
      { name: "Lambda",     level: 85, category: "cloud" },
    ],
  },
  {
    id: "devops",
    label: "[DEVOPS]",
    skills: [
      { name: "Terraform",  level: 88, category: "devops" },
      { name: "Docker",     level: 85, category: "devops" },
      { name: "Kubernetes", level: 70, category: "devops" },
      { name: "GitHub Actions", level: 85, category: "devops" },
      { name: "CI/CD",      level: 86, category: "devops" },
    ],
  },
  {
    id: "security",
    label: "[SECURITY]",
    skills: [
      { name: "IAM / Policies", level: 85, category: "security" },
      { name: "WAF / Shield",   level: 75, category: "security" },
      { name: "VPN / VPC",      level: 80, category: "security" },
    ],
  },
  {
    id: "dev",
    label: "[DEV]",
    skills: [
      { name: "C#",     level: 80, category: "dev" },
      { name: "Bash / Shell", level: 88, category: "dev" },
      { name: "Next.js",    level: 70, category: "dev" },
      { name: "SQL",        level: 84, category: "dev" },
    ],
  },
];

// ─── Experience ────────────────────────────────────────────────
export const EXPERIENCES: Experience[] = [
  {
    id: "exp-01",
    role: "Cloud & DevOps Engineer",
    company: "Freelance / Remote",
    period: "2024 - 2025",
    location: "Remote",
    type: "remote",
    description: [
      "Diseñé e implementé una arquitectura Serverless y CDN de alto rendimiento utilizando",
      "AWS S3 y CloudFront, configurando SSL/TLS para garantizar entrega global segura y",
      "de baja latencia, reduciendo los tiempos de carga en un 60%.",

      "Automaticé pipelines de integración y despliegue continuo (CI/CD) con GitHub Actions,",
      "eliminando el error humano en los procesos de release y reduciendo el tiempo de despliegue en un 40%.",

      "Optimicé el control de costos de infraestructura AWS configurando alertas de consumo",
      "con AWS Budgets, logrando un monitoreo en tiempo real del gasto proyectado vs. real y",
      "evitando sobrecostos no planificados."
      
    ],
    tech: ["AWS", "Terraform", "CDN", "SSL/TLS", "S3", "GitHub Actions", "CloudFront", "CI/CD", "Budgets"],
  },
  {
    id: "exp-02",
    role: "Ingeniero de Investigación y Desarrollo",
    company: "TNS S.A.S",
    period: "2022 — 2023",
    location: "Colombia",
    type: "onsite",
    description: [
      "Gestioné y automaticé despliegues en múltiples entornos cloud, reduciendo los tiempos",
      "de entrega y garantizando alta disponibilidad de los servicios.",

      "Administré y optimicé infraestructuras en AWS, implementando buenas prácticas de seguridad",
      "y monitoreo continuo que mejoraron el rendimiento y la estabilidad de los sistemas.",

      "Automaticé procesos críticos de integración y generación de pruebas unitarias,",
      "aumentando la calidad del software y reduciendo errores en producción.",
 
    ],
    tech: ["AWS", "EC2", "RDS", "VPC", "S3", "CloudWatch", "MySQL", "GitHub", "Soporte Técnico"],
  },
  {
    id: "exp-03",
    role: "Tecnico de Investigación y Desarrollo",
    company: "TNS S.A.S",
    period: "2021 — 2022",
    location: "Colombia",
    type: "onsite",
    description: [
      "Ejecuté pruebas de integración en microservicios y validación de APIs, garantizando",
      "la estabilidad y el correcto funcionamiento de los servicios en producción.",
      "Desarrollé una herramienta interna para automatizar el envío de datos y la generación",
      "de reportes técnicos en formato CSV, optimizando el análisis de rendimiento y",
      "reduciendo el tiempo de revisión manual en un 50%.",
 
    ],
    tech: ["C#", "MySQL", "Automatización", "Pruebas de Integración", "Reportes CSV"],
  },
];

// ─── Education ─────────────────────────────────────────────────
export const EDUCATIONS: Education[] = [
  {
    id: "edu-01",
    degree: "Ingeniería de Sistemas",
    institution: "Universidad de Pamplona",
    period: "2015 — 2021",
    status: "completed",
  },
];

export const CERTIFICATIONS: Certification[] = [
  {
    id: "cert-01",
    name: "Shell Scripting en Linux",
    issuer: "LinkedIn Learning",
    year: "2026",
  },
  {
    id: "cert-02",
    name: "Kubernetes",
    issuer: "Platzi",
    year: "2026",
  },
  {
    id: "cert-03",
    name: "Intoducción a DevOps",
    issuer: "Platzi",
    year: "2026",
  },
  {
    id: "cert-04",
    name: "GitHub Actions",
    issuer: "Platzi",
    year: "2026",
  },
  {
    id: "cert-05",
    name: "Fundamentos de AWS Cloud",
    issuer: "Platzi",
    year: "2026",
  },
  {
    id: "cert-06",
    name: "Terraform",
    issuer: "Platzi",
    year: "2026",
  },
  {
    id: "cert-07",
    name: "Docker Avanzado",
    issuer: "Platzi",
    year: "2026",
  },
  {
    id: "cert-08",
    name: "Docker Fundamentos",
    issuer: "Platzi",
    year: "2026",
  },
  {
    id: "cert-09",
    name: "AWS Cloud Practitioner Essentials",
    issuer: "AWS Skill Builder",
    year: "2026",
  },
  {
    id: "cert-10",
    name: "Getting Started with DevOps on AWS",
    issuer: "AWS Skill Builder",
    year: "2026",
  },
  {
    id: "cert-11",
    name: "General English Course",
    issuer: "Oxford House College",
    year: "2024",
  },
];

// ─── Projects ──────────────────────────────────────────────────
export const PROJECTS: Project[] = [
  {
    id: "proj-01",
    title: "Pipeline CI/CD End-to-End: IaC con Terraform + AWS EC2 + Cloudflare Zero Trust",
    description: [
      "Diseñé e implementé una infraestructura completa como código (IaC) con Terraform,",
      "aprovisionando VPC, EC2 y ECR en AWS. Construí un pipeline CI/CD con GitHub Actions",
      "que automatiza la construcción de imágenes Docker, su publicación en ECR y el despliegue",
      "en EC2 mediante AWS SSM, eliminando la necesidad de acceso SSH. La exposición a internet",
      "se realizó de forma segura a través de Cloudflare Zero Trust Tunnel con SSL automático,",
      "garantizando zero puertos abiertos en producción.",
    ],
    tech: ["AWS", "S3", "EC2", "VPC", "ECR", "Lambda", "EventBridge", "CloudWatch", "IAM", "SNS", 
            "Docker", "GitHub Actions", "Terraform", "Cloudflare", "CI/CD", "SSL/TLS", "Zero Trust"],
    repoUrl: "https://github.com/omargarcia/portfolio",
    demoUrl: "https://omargarcia.xyz",
    status: "active",
    highlights: [
      "Infraestructura 100% como código con Terraform",
      "Pipeline CI/CD completamente automatizado con GitHub Actions",
      "Despliegue seguro sin puertos abiertos usando Cloudflare Zero Trust Tunnel",
    ],
  },
  {
    id: "proj-02",
    title: "AWS Static Website Deployment (IaC + CI/CD)",
    description: [
      "Diseñé una arquitectura serverless y altamente disponible en AWS para el despliegue de un",
      "sitio web estático, centrada en la automatización y la seguridad. El proyecto implementa",
      "un flujo donde la infraestructura es tratada como código (IaC), permitiendo que sea",
      "reproducible y auditable mediante el uso de módulos versionados.",
    ],
    tech: ["AWS", "S3", "CloudFront", "CDN", "CI/CD", "GitHub Actions", "Terraform", "SSL/TLS", "Budgets"],
    repoUrl: "https://github.com/omargarcia/cloudops",
    status: "active",
    highlights: [
      "Despliegue de sitio web estático con AWS S3 y CloudFront",
      "Automatización completa del despliegue con GitHub Actions",
      "Implementación de SSL/TLS para seguridad y reducción de latencia global",
    ],
  },
];

// ─── API Gateway endpoint (se configura vía env var) ───────────
export const API_ENDPOINT =
  process.env.NEXT_PUBLIC_API_ENDPOINT ?? "https://api.omargarcia.xyz/contact";
