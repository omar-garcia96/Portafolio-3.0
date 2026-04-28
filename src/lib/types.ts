// ─── Navigation ────────────────────────────────────────────
export interface NavLink {
  label: string;
  href: string;
}

// ─── Skills ─────────────────────────────────────────────────
export interface Skill {
  name: string;
  level: number; // 0-100
  category: "cloud" | "security" | "devops" | "dev" | "os";
}

export interface SkillCategory {
  id: string;
  label: string;
  skills: Skill[];
}

// ─── Experience ──────────────────────────────────────────────
export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  type: "remote" | "onsite" | "hybrid";
  description: string[];
  tech: string[];
}

// ─── Education ───────────────────────────────────────────────
export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  status: "completed" | "in-progress";
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
  badge?: string;
  credentialId?: string;
}

// ─── Projects ────────────────────────────────────────────────
export interface Project {
  id: string;
  title: string;
  description: string[];
  tech: string[];
  repoUrl?: string;
  demoUrl?: string;
  status: "active" | "archived" | "in-progress";
  highlights: string[];
}

// ─── Contact form ─────────────────────────────────────────────
export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}
