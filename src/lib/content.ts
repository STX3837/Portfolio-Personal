export type Locale = 'es' | 'en';

type Translated = Record<Locale, string>;

export const profile = {
  name: 'Alberto Paleteiro',
  github: '', // Añadir enlace público real
  linkedin: '', // Añadir enlace público real
  email: '', // Añadir email profesional
};

export const copy = {
  es: {
    role: 'Ingeniero del Software',
    greeting: 'Hola, soy Alberto.',
    headline: 'Diseño y construyo soluciones digitales.',
    intro: 'Desarrollo aplicaciones web centradas en la calidad del software, la escalabilidad y la experiencia de usuario.',
    projects: 'Proyectos', about: 'Sobre mí', contact: 'Contacto', viewProjects: 'Ver proyectos',
    featured: 'Proyectos destacados', aboutTitle: 'Sobre mí',
    aboutText: 'Soy ingeniero del software con interés en el desarrollo full-stack, la arquitectura de aplicaciones y la inteligencia artificial.',
    contactTitle: 'Hablemos', contactText: '¿Tienes una propuesta o quieres colaborar en algún proyecto?',
    mail: 'Enviar email', source: 'Código', footer: 'Desarrollado con Astro y TypeScript.',
    switchLanguage: 'Read in English',
  },
  en: {
    role: 'Software Engineer',
    greeting: "Hi, I'm Alberto.",
    headline: 'I design and build digital solutions.',
    intro: 'I develop web applications with a focus on software quality, scalability, and user experience.',
    projects: 'Projects', about: 'About', contact: 'Contact', viewProjects: 'View projects',
    featured: 'Featured projects', aboutTitle: 'About me',
    aboutText: "I'm a software engineer interested in full-stack development, application architecture, and artificial intelligence.",
    contactTitle: "Let's talk", contactText: 'Have an idea or want to collaborate on a project?',
    mail: 'Send email', source: 'Source', footer: 'Built with Astro and TypeScript.',
    switchLanguage: 'Leer en español',
  },
} as const;

export type Project = {
  slug: string;
  title: string;
  description: Translated;
  tags: string[];
  repository?: string;
};

export const projects: Project[] = [
  {
    slug: 'distans', title: 'DISTANS',
    description: {
      es: 'Marketplace de proximidad con geolocalización, pagos y reserva concurrente de stock.',
      en: 'Local marketplace with geolocation, payments, and concurrent stock reservation.',
    },
    tags: ['Django', 'PostGIS', 'Stripe'],
  },
  {
    slug: 'aura', title: 'AURA',
    description: {
      es: 'Planificador de viajes personalizado mediante inteligencia artificial.',
      en: 'Personalized travel planner powered by artificial intelligence.',
    },
    tags: ['AI', 'Web', 'Maps'],
  },
  {
    slug: 'cyber-simulation', title: 'Cyber Simulation',
    description: {
      es: 'Simulación de ciberataques y predicción mediante redes neuronales.',
      en: 'Cyberattack simulation and neural network-based prediction.',
    },
    tags: ['Python', 'NetLogo', 'Keras'],
  },
];
