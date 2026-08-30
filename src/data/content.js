/**
 * Portfolio content — single source of truth for all sections.
 * Keep this file as the editable content surface (admin/dashboard-friendly).
 */

export const profile = {
  name: 'Shubham Tiwari',
  shortName: 'Shubham Tiwari',
  initials: 'ST',
  role: 'Senior Software Engineer',
  tagline:
    '7+ years building high-throughput, fault-tolerant backend systems and distributed microservices with PHP, Laravel, Zend, Drupal, and cloud-native deployments.',
  stackLine: 'PHP • Laravel • Zend • Drupal • MongoDB • AWS • REST / GraphQL',
  availability: 'Open to new opportunities',
  location: 'Bengaluru, India',
  email: 'shubhamtiwariforjob@gmail.com',
  emailMailto: 'mailto:shubhamtiwariforjob@gmail.com',
  phone: '+91 86993 82375',
  phoneHref: 'tel:+918699382375',
  linkedin: 'https://www.linkedin.com/in/shubham-tiwari',
  github: 'https://github.com/shubhamtiwari',
  resumeUrl: '/Shubham_Tiwari_CV.pdf',
  resumeFileName: 'Shubham_Tiwari_CV.pdf',
  stats: [
    { num: '7+', label: 'Years Experience' },
    { num: '5', label: 'Companies' },
    { num: '99.9%', label: 'Availability Focus' },
  ],
}

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export const about = {
  eyebrow: 'About',
  title: 'Backend systems & distributed architecture',
  subtitle: 'Senior backend engineer focused on high-throughput services, data-tier modernization, and high availability.',
  leadershipTitle: 'Professional summary',
  leadershipBody: [
    'Senior Software Engineer with 7+ years of core backend engineering experience building high-throughput, fault-tolerant enterprise web applications and distributed microservices.',
    'Proven expertise in PHP (7.x/8.x), modern MVC frameworks (Laravel, Zend, CodeIgniter), event-driven systems, caching strategies, and large-scale data tier modernization (MySQL to MongoDB). Strong background in OOP design, RESTful/GraphQL APIs, cloud-native deployments on AWS/Azure, CI/CD automation, and database query optimization.',
  ],
  bringTitle: 'What I bring',
  bringItems: [
    'Distributed systems & microservices on PHP 8.x',
    'High-performance REST & GraphQL API design',
    'MySQL → MongoDB data-tier modernization',
    'Redis / Memcached caching for peak traffic',
    'AWS / Azure, Docker & CI/CD automation',
  ],
  highlights: [
    {
      id: 'backend',
      title: 'Backend Architecture',
      desc: 'High-throughput PHP services, modular microservices, and fault-tolerant designs for enterprise workloads.',
    },
    {
      id: 'data',
      title: 'Data Tier Modernization',
      desc: 'Schema modernization, query indexing, and MySQL-to-MongoDB migrations that cut P99 read latency under peak traffic.',
    },
    {
      id: 'api',
      title: 'APIs & Event Systems',
      desc: 'RESTful and GraphQL contracts, caching layers, and event-driven integrations across web and mobile clients.',
    },
    {
      id: 'cloud',
      title: 'Cloud & DevOps',
      desc: 'AWS (EC2, S3, RDS, CloudWatch), Azure, Docker, and CI/CD pipelines that cut release overhead and build failures.',
    },
  ],
}

export const skillGroups = [
  {
    title: 'Languages & Backend',
    skills: ['PHP (7.x/8.x)', 'Node.js', 'JavaScript (ES6+)', 'SQL', 'Core Java'],
  },
  {
    title: 'Frameworks & CMS',
    skills: ['Laravel', 'Zend Framework', 'CodeIgniter', 'Drupal (7–10)', 'WordPress'],
  },
  {
    title: 'Architecture & APIs',
    skills: ['Microservices', 'RESTful APIs', 'GraphQL', 'Redis', 'Memcached', 'Event-Driven'],
  },
  {
    title: 'Databases & Storage',
    skills: ['MySQL', 'MongoDB', 'Query Optimization', 'Schema Modernization'],
  },
  {
    title: 'Cloud, DevOps & CI/CD',
    skills: ['AWS (EC2, S3, RDS, CloudWatch)', 'Microsoft Azure', 'Docker', 'Git', 'CI/CD', 'Linux'],
  },
  {
    title: 'Engineering Practices',
    skills: ['System Design', 'TDD', 'PHPUnit', 'Agile/Scrum', 'Code Reviews', 'High Availability'],
  },
]

export const alsoUsed = [
  'Generators',
  'Design Patterns',
  'Connection Pooling',
  'ActiveBatch',
  'SOAP APIs',
  'Webhooks',
  'SOLID',
  'Production Debugging',
]

export const experiences = [
  {
    role: 'Senior Software Engineer',
    company: 'ALLEN Digital',
    period: 'May 2025 — Present',
    duration: 'Present',
    type: 'Full-time',
    location: 'Bengaluru, India',
    highlights: [
      'Architected and scaled the backend for the enterprise Question Repository System serving high-concurrency educational workloads using PHP 8.x, Zend Framework, and modular microservices.',
      'Spearheaded data tier migration of unstructured exam assets from MySQL to MongoDB, reducing P99 read latencies by ~35% and improving concurrent database throughput under peak exam traffic.',
      'Designed and standardized high-performance RESTful API contracts with distributed caching layers (Redis/Memcached), maintaining 99.9% service availability across web and mobile platforms.',
      'Automated deployment workflows with Docker and CI/CD pipelines, decreasing release overhead and build failure rates by 40%.',
      'Collaborated with Product, Frontend, and DevOps in 2-week Agile sprints; authored technical design specs and led code reviews for backend modules.',
    ],
    tech: ['PHP 8.x', 'Zend', 'MongoDB', 'MySQL', 'Redis', 'Docker', 'CI/CD'],
  },
  {
    role: 'Senior Software Engineer',
    company: 'Softtek',
    period: 'May 2022 — Jan 2025',
    duration: '2 yrs 9 mos',
    type: 'Full-time',
    location: 'Bengaluru, India',
    highlights: [
      'Engineered and maintained high-traffic enterprise platforms and custom PHP services on Drupal 8/9/10 for Fortune 500 corporate clients.',
      'Identified critical system bottlenecks and tuned complex MySQL queries, improving average page load performance by 30%.',
      'Integrated third-party enterprise REST/SOAP APIs, authentication layers, and webhooks within cloud-hosted environments (Microsoft Azure / AWS).',
      'Enforced strict coding standards, conducted peer reviews, and mentored junior engineers on SOLID principles and clean architecture.',
    ],
    tech: ['Drupal 8/9/10', 'PHP', 'MySQL', 'REST/SOAP', 'Azure', 'AWS'],
  },
  {
    role: 'Software Engineer',
    company: 'Soroco India',
    period: 'Sep 2021 — Jan 2022',
    duration: '5 mos',
    type: 'Full-time',
    location: 'Bengaluru, India',
    highlights: [
      'Developed scalable transaction management and scheduling backend modules using Laravel and REST APIs.',
      'Implemented automated infrastructure deployment workflows and cloud asset management on AWS.',
    ],
    tech: ['Laravel', 'REST APIs', 'AWS'],
  },
  {
    role: 'Software Engineer',
    company: 'Erfolg',
    period: 'Jul 2019 — Jul 2021',
    duration: '2 yrs',
    type: 'Full-time',
    location: 'Chandigarh, India',
    highlights: [
      'Built core server-side business logic and normalized relational databases utilizing PHP and MySQL for high-volume management portals.',
      'Implemented secure API integrations and optimized SQL queries, reducing API response times under concurrent request loads.',
    ],
    tech: ['PHP', 'MySQL', 'REST APIs'],
  },
  {
    role: 'Software Engineer',
    company: 'Univisionz',
    period: 'Dec 2017 — Jun 2019',
    duration: '1 yr 7 mos',
    type: 'Full-time',
    location: 'Mohali, India',
    highlights: [
      'Developed custom WordPress CMS architectures, bespoke plugins, and reusable Core PHP backend components.',
      'Constructed asynchronous data pipelines with RESTful APIs, AJAX, and JavaScript for seamless frontend-backend integration.',
    ],
    tech: ['WordPress', 'Core PHP', 'REST APIs', 'JavaScript'],
  },
]

export const education = [
  {
    title: 'B.Tech — Computer Science & Engineering',
    issuer: 'Punjab Technical University, Punjab, India · 2013 – 2017',
  },
]

export const certifications = []

export const projects = [
  {
    title: 'ALLEN Question Repository & Assessment Engine',
    category: 'EdTech Backend',
    badge: 'PHP 8',
    desc: 'Enterprise question repository managing millions of assessment records with high-throughput read paths and decoupled data ingestion pipelines.',
    features: [
      'Millions of assessment records at scale',
      'High-throughput read paths',
      'Decoupled data ingestion pipelines',
      'MySQL + MongoDB hybrid data tier',
    ],
    tech: ['PHP 8', 'Zend', 'MongoDB', 'MySQL', 'REST APIs', 'Docker'],
  },
  {
    title: 'WabtecCorp Enterprise Platform',
    category: 'Enterprise CMS',
    badge: 'Drupal',
    desc: 'Enterprise content platform with resilient backend modules and cloud-hosted data workflows ensuring 99.9% uptime.',
    features: [
      'Drupal 9/10 enterprise CMS',
      'Resilient backend modules',
      'Cloud-hosted data workflows',
      '99.9% uptime focus',
    ],
    tech: ['Drupal 9/10', 'PHP', 'Cloud Hosting', 'REST'],
  },
  {
    title: 'Browzwear 3D Integration Platform',
    category: 'Digital Assets',
    badge: 'GraphQL',
    desc: 'Unified data synchronization services integrating GraphQL endpoints with backend business modules for digital asset management.',
    features: [
      'GraphQL + REST synchronization',
      'Digital asset management flows',
      'Unified backend business modules',
      'Relational DB integration',
    ],
    tech: ['PHP', 'GraphQL', 'REST APIs', 'Relational DB'],
  },
]

export const projectsNote =
  'Key systems spanning assessment engines, Fortune 500 enterprise CMS, and GraphQL-backed digital asset platforms — with ownership across architecture, performance, and production reliability.'

export const contactCopy = {
  eyebrow: 'Contact',
  title: "Let's discuss backend systems, distributed architecture, and scalable delivery.",
  subtitle:
    'Reach out via email, phone, or LinkedIn. Open to senior backend roles focused on PHP, microservices, data-tier modernization, and cloud-native delivery.',
  responseNote: 'Typically responds within 24 hours',
  responseBody:
    'Open to Senior Software Engineer / backend systems roles. Based in Bengaluru, India.',
  formTitle: 'Send a message',
  successTitle: 'Message sent successfully!',
  successBody: "I'll get back to you within 24 hours.",
}
