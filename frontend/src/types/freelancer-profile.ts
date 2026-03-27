export const JobTitles = {
  FULL_STACK: "Full Stack Developer",
  FRONTEND: "Frontend Developer",
  BACKEND: "Backend Developer",
  DEVOPS: "DevOps Engineer",
  SOFTWARE_ENGINEER: "Software Engineer",
  SOFTWARE_DEVELOPER: "Software Developer",
  NONE: "No Job Title",
} as const;

export type JobTitle = (typeof JobTitles)[keyof typeof JobTitles];

export const Skills = {
  NO_SKILLS: "No Skills",

  // Front-End
  HTML: "HTML",
  CSS: "CSS",
  SCSS: "SCSS",
  JavaScript: "JavaScript",
  TypeScript: "TypeScript",
  React: "React",
  Angular: "Angular",
  Vue: "Vue",
  Svelte: "Svelte",
  NextJS: "NextJS",
  NuxtJS: "NuxtJS",
  Redux: "Redux",
  Zustand: "Zustand",
  Tailwind: "Tailwind",
  Bootstrap: "Bootstrap",
  MaterialUI: "MaterialUI",
  ChakraUI: "ChakraUI",
  AntDesign: "AntDesign",

  // Back-End
  NodeJS: "NodeJS",
  BunJs: "BunJs",
  NestJS: "NestJS",
  ExpressJS: "ExpressJS",
  Koa: "Koa",
  Fastify: "Fastify",
  Python: "Python",
  Django: "Django",
  Flask: "Flask",
  Ruby: "Ruby",
  Rails: "Rails",
  Java: "Java",
  SpringBoot: "SpringBoot",
  PHP: "PHP",
  Laravel: "Laravel",

  // Databases
  MongoDB: "MongoDB",
  MySQL: "MySQL",
  PostgreSQL: "PostgreSQL",
  SQLite: "SQLite",
  Redis: "Redis",

  // DevOps & Tools
  Docker: "Docker",
  Kubernetes: "Kubernetes",
  Git: "Git",
  GitHub: "GitHub",
  GitLab: "GitLab",
  CI_CD: "CI/CD",
  AWS: "AWS",
  Azure: "Azure",
  GCP: "GCP",
  Firebase: "Firebase",
  Vercel: "Vercel",
  Netlify: "Netlify",
  Render: "Render",

  GraphQL: "GraphQL",
  RESTAPI: "REST API",
  WebSockets: "WebSockets",
  JWT: "JWT",
  Testing: "Testing",
  Jest: "Jest",
  Cypress: "Cypress",
} as const;

export type Skill = (typeof Skills)[keyof typeof Skills];

export interface IFreelancer {
  _id: string;
  freelancerId: string;
  jobTitle: JobTitle;
  bio: string;
  skills: Skill[];
  hourlyRate: number;
  rating: number;
  completedJobs: number;
  createdAt?: Date;
  updatedAt?: Date;
}
