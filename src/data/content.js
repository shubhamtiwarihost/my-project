/**
 * Portfolio content — single source of truth for all sections.
 * Keep this file as the editable content surface (admin/dashboard-friendly).
 */

export const profile = {
  name: 'Shubham Tiwari',
  shortName: 'Shubham Tiwari',
  initials: 'ST',
  role: 'Elite Senior PHP Developer',
  tagline:
    '6+ years building high-performance backend systems, enterprise CMS platforms, and scalable web applications with PHP, Laravel, Drupal, and AWS.',
  stackLine: 'PHP • Laravel • Drupal • AWS • REST APIs',
  availability: 'Open to new opportunities',
  location: 'Bangalore, India',
  email: 'ershubhamtiwari@yahoo.com',
  emailMailto: 'mailto:ershubhamtiwari@yahoo.com',
  phone: '+91 86993 82375',
  phoneHref: 'tel:+918699382375',
  phoneAlt: '+91 80909 15141',
  linkedin: 'https://www.linkedin.com/in/shubham-tiwari-35077193',
  github: 'https://github.com/shubhamtiwarihost',
  stats: [
    { num: '6+', label: 'Years Experience' },
    { num: '5', label: 'Companies' },
    { num: '4+', label: 'Key Platforms' },
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
  title: 'Experience summary',
  subtitle: 'Backend-focused PHP engineering across enterprise CMS and scalable platforms.',
  leadershipTitle: 'Backend & platform focus',
  leadershipBody: [
    'I build high-performance backend systems and enterprise CMS platforms with a focus on reliability, security, and scale. My work spans PHP, Laravel, Drupal (7–10), REST APIs, GraphQL, and MySQL optimization.',
    'Experienced with AWS cloud infrastructure, CI/CD pipelines, and modern development practices to deliver robust digital platforms for large user bases and enterprise clients.',
  ],
  bringTitle: 'What I bring',
  bringItems: [
    'High-performance PHP backend systems',
    'Enterprise CMS platforms with Drupal 7–10',
    'REST API & GraphQL design and integrations',
    'MySQL / PostgreSQL schema optimization',
    'AWS infrastructure, Docker & CI/CD delivery',
  ],
  highlights: [
    {
      id: 'backend',
      title: 'Backend Architecture',
      desc: 'Scalable PHP and Laravel services designed for performance, maintainability, and production reliability.',
    },
    {
      id: 'cms',
      title: 'Enterprise CMS',
      desc: 'Drupal 7–10 platforms for corporate and enterprise clients, with custom modules and performance tuning.',
    },
    {
      id: 'api',
      title: 'API & Integrations',
      desc: 'REST APIs, GraphQL, OAuth2, and JWT enabling secure integrations across internal and external systems.',
    },
    {
      id: 'cloud',
      title: 'Cloud & DevOps',
      desc: 'AWS (EC2, S3, RDS, Lambda), Docker, and CI/CD pipelines for secure, scalable deployments.',
    },
  ],
}

export const skillGroups = [
  {
    title: 'Languages',
    skills: ['PHP', 'JavaScript'],
  },
  {
    title: 'Frameworks & CMS',
    skills: ['Laravel', 'Drupal (7/8/9/10)', 'CodeIgniter'],
  },
  {
    title: 'Frontend',
    skills: ['HTML5', 'CSS3', 'React', 'Bootstrap', 'jQuery'],
  },
  {
    title: 'APIs & Auth',
    skills: ['REST API', 'GraphQL', 'OAuth2', 'JWT'],
  },
  {
    title: 'Databases',
    skills: ['MySQL', 'PostgreSQL', 'NoSQL'],
  },
  {
    title: 'Cloud & DevOps',
    skills: ['AWS (EC2, S3, RDS, Lambda)', 'Docker', 'CI/CD', 'Jenkins', 'Git', 'GitHub', 'Composer'],
  },
]

export const alsoUsed = [
  'Agile',
  'JIRA',
  'Jenkins',
  'Composer',
  'GitHub',
  'OAuth2',
  'JWT',
  'GraphQL',
  'Lambda',
  'RDS',
  'S3',
  'EC2',
]

export const experiences = [
  {
    role: 'Software Engineer',
    company: 'Allen Digital',
    period: 'May 2025 — Present',
    duration: 'Present',
    type: 'Full-time',
    location: 'Bangalore, India',
    highlights: [
      'Develop backend services supporting digital learning platforms used by large user bases.',
      'Improve platform reliability and scalability through backend system enhancements.',
      'Support integrations and system improvements for enterprise web platforms.',
    ],
    tech: ['PHP', 'Laravel', 'MySQL', 'REST APIs', 'AWS'],
  },
  {
    role: 'Software Engineer',
    company: 'Softtek',
    period: 'May 2022 — Jan 2025',
    duration: '2 yrs 9 mos',
    type: 'Full-time',
    location: 'Bangalore, India',
    highlights: [
      'Developed enterprise web applications using PHP, Laravel, and Drupal CMS.',
      'Designed optimized database schemas improving application performance.',
      'Built REST APIs enabling integrations between internal and external enterprise systems.',
    ],
    tech: ['PHP', 'Laravel', 'Drupal', 'MySQL', 'REST APIs'],
  },
  {
    role: 'Software Engineer',
    company: 'Soroco India Pvt Ltd',
    period: 'Sep 2021 — Jan 2022',
    duration: '5 mos',
    type: 'Full-time',
    location: 'Bangalore, India',
    highlights: [
      'Developed Drupal-based web applications for enterprise client projects.',
      'Built responsive web platforms using PHP, HTML, CSS, and JavaScript.',
    ],
    tech: ['PHP', 'Drupal', 'HTML5', 'CSS3', 'JavaScript'],
  },
  {
    role: 'Software Engineer',
    company: 'Erfolg',
    period: 'Jul 2019 — Jul 2021',
    duration: '2 yrs',
    type: 'Full-time',
    location: 'Bangalore, India',
    highlights: [
      'Developed custom backend applications and CMS-driven platforms.',
      'Collaborated with product teams to design scalable software solutions.',
    ],
    tech: ['PHP', 'CMS', 'MySQL', 'JavaScript'],
  },
  {
    role: 'Software Engineer',
    company: 'Univisionz',
    period: 'Dec 2017 — Jun 2019',
    duration: '1 yr 7 mos',
    type: 'Full-time',
    location: 'Chandigarh, India',
    highlights: [
      'Built PHP-based websites and CMS systems including e-commerce platforms.',
      'Developed backend modules, payment integrations, and database structures.',
    ],
    tech: ['PHP', 'CMS', 'MySQL', 'E-commerce'],
  },
]

export const education = [
  {
    title: 'B.Tech — Computer Science',
    issuer: 'Lovely Professional University · 2013 – 2017',
  },
]

export const certifications = []

export const projects = [
  {
    title: 'Targus Platform',
    category: 'Enterprise Banking',
    badge: 'Backend',
    desc: 'Enterprise banking backend platform built with PHP, SQL, and AWS for secure, scalable financial workflows.',
    features: [
      'Enterprise banking backend services',
      'SQL-backed data architecture',
      'AWS cloud infrastructure',
      'Secure production delivery',
    ],
    tech: ['PHP', 'SQL', 'AWS'],
  },
  {
    title: 'Wabteccorp.com',
    category: 'Corporate CMS',
    badge: 'Drupal',
    desc: 'Drupal-based corporate platform with optimized performance for enterprise content and web delivery.',
    features: [
      'Drupal CMS architecture',
      'Corporate content platform',
      'Performance optimization',
      'Enterprise web delivery',
    ],
    tech: ['Drupal', 'PHP', 'MySQL'],
  },
  {
    title: 'Mindmygrades.com',
    category: 'EdTech Platform',
    badge: 'Core PHP',
    desc: 'Online learning platform backend built with Core PHP and MySQL, supporting digital education workflows.',
    features: [
      'Online learning backend',
      'Core PHP application layer',
      'MySQL data model',
      'Student and content workflows',
    ],
    tech: ['Core PHP', 'MySQL'],
  },
  {
    title: 'Activeadultliving.com',
    category: 'Real Estate',
    badge: 'Backend',
    desc: 'Real estate platform backend serving US communities with content and listing-driven web experiences.',
    features: [
      'Real estate platform backend',
      'Community-focused web delivery',
      'US market platform support',
      'Content and listing workflows',
    ],
    tech: ['PHP', 'CMS', 'MySQL'],
  },
]

export const projectsNote =
  'Selected platform work spanning enterprise banking, corporate CMS, edtech, and real estate backends — with ownership across architecture, delivery, and production support.'

export const contactCopy = {
  eyebrow: 'Contact',
  title: "Let's discuss backend systems, CMS platforms, and scalable PHP delivery.",
  subtitle:
    'Reach out via email, phone, or LinkedIn — clear communication and fast response. Open to senior PHP, Laravel, Drupal, and AWS-focused roles.',
  responseNote: 'Typically responds within 24 hours',
  responseBody:
    'Open to senior PHP / Laravel / Drupal roles and complex backend or enterprise CMS engagements. Based in Bangalore, India.',
  formTitle: 'Send a message',
  successTitle: 'Message sent successfully!',
  successBody: "I'll get back to you within 24 hours.",
}
