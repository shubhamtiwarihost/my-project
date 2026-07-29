/**
 * Portfolio content — single source of truth for all sections.
 * Keep this file as the editable content surface (admin/dashboard-friendly).
 */

export const profile = {
  name: 'Shubham Tiwari Chawla',
  shortName: 'Shubham Tiwari',
  initials: 'ST',
  role: 'Senior Full-stack PHP Developer',
  tagline:
    '10+ years of hands-on full-stack PHP development across product and services environments. Building scalable enterprise applications, SaaS platforms, and WordPress solutions.',
  stackLine: 'PHP • Laravel • MySQL • REST APIs',
  availability: 'Available for new opportunities',
  location: 'Mumbai, India',
  email: 'ShubhamTiwari@gmail.com',
  emailMailto: 'mailto:ShubhamTiwari@gmail.com',
  phone: '+91 98XXX XXXXX',
  phoneHref: null,
  linkedin: 'https://www.linkedin.com/in/shubhamtiwari-chawla-818298a1',
  github: 'https://github.com/shubhamtiwarihost',
  stats: [
    { num: '10+', label: 'Years Experience' },
    { num: '50+', label: 'Projects Delivered' },
    { num: '100%', label: 'Delivery Ownership' },
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
  subtitle: 'Senior full-stack engineering with delivery ownership.',
  leadershipTitle: 'A leadership-first approach',
  leadershipBody: [
    'I build enterprise applications that balance quality, speed, and operational reality. My focus is clean architecture, resilient integrations, and delivery practices that scale across teams.',
    'Experienced in PHP development, SaaS applications, WordPress solutions, API integrations, team leadership, and end-to-end project delivery.',
  ],
  bringTitle: 'What I bring',
  bringItems: [
    'Requirement gathering & stakeholder alignment',
    'End-to-end accountability from planning to release',
    'Smooth handoffs with QA, DevOps & Product',
    'Security, performance & reliability practices',
    'Mentoring, code reviews & estimation',
  ],
  highlights: [
    {
      id: 'architecture',
      title: 'Enterprise Architecture',
      desc: 'Scalable, maintainable systems built with clean architecture principles and battle-tested patterns.',
    },
    {
      id: 'saas',
      title: 'SaaS & Product Delivery',
      desc: 'End-to-end ownership from planning to release. SaaS platforms delivered with speed and reliability.',
    },
    {
      id: 'api',
      title: 'API & Integrations',
      desc: 'Complex REST API design, third-party integrations, and seamless inter-service communication.',
    },
    {
      id: 'leadership',
      title: 'Team Leadership',
      desc: 'Mentoring engineers, conducting code reviews, estimation, and building execution consistency.',
    },
  ],
}

export const skillGroups = [
  {
    title: 'Backend',
    skills: ['PHP', 'Laravel', 'MySQL', 'REST APIs', 'Node.js', 'OOP / MVC', 'SOLID Principles'],
  },
  {
    title: 'Frontend',
    skills: ['JavaScript', 'HTML5', 'CSS3', 'jQuery', 'Vue.js (basics)', 'React (basics)'],
  },
  {
    title: 'WordPress & CMS',
    skills: ['WordPress', 'WooCommerce', 'Custom Plugins', 'Theme Development', 'ACF', 'Elementor'],
  },
  {
    title: 'Infrastructure & Tools',
    skills: ['AWS', 'AWS CloudWatch', 'Docker', 'Git', 'CI/CD Pipelines', 'Postman', 'Twilio'],
  },
  {
    title: 'Integrations',
    skills: ['Stripe', 'PayPal', 'Twilio SMS', 'SendGrid', 'OAuth / JWT', 'Google APIs', 'Webhooks'],
  },
  {
    title: 'Leadership & Process',
    skills: ['Agile / Scrum', 'JIRA', 'Code Reviews', 'Team Mentoring', 'Client Communication', 'Estimation'],
  },
]

export const alsoUsed = [
  'Reliability',
  'Security',
  'Performance',
  'Maintainability',
  'Confluence',
  'Kanban',
  'Google Authenticator',
  'Redis',
  'cURL',
  'phpUnit',
  'Composer',
  'npm',
]

export const experiences = [
  {
    role: 'Senior PHP Developer & Team Lead',
    company: 'InnovationalIdea',
    period: 'Sep 2014 — Feb 2026',
    duration: '11+ years',
    type: 'Full-time',
    location: 'Mumbai, India',
    highlights: [
      'Led end-to-end delivery of enterprise SaaS platforms, internal tools, and client-facing WordPress solutions.',
      'Architected and developed scalable Laravel applications with clean separation of concerns and robust REST APIs.',
      'Managed cross-functional teams of 5–10 engineers, running Agile sprints, code reviews, and mentoring sessions.',
      'Served as primary technical point-of-contact for UK-based clients — requirement gathering, expectation management, and delivery reporting.',
      'Implemented CI/CD pipelines, AWS deployments, and production-grade monitoring with CloudWatch.',
      'Delivered Google Authenticator-based 2FA, Stripe/PayPal integrations, and complex role-based access systems.',
    ],
    tech: ['PHP', 'Laravel', 'MySQL', 'WordPress', 'AWS', 'Docker', 'REST APIs', 'JavaScript'],
  },
]

export const certifications = [
  {
    title: 'Lead with an Impact',
    issuer: 'Team Leaders Accelerator Program',
  },
  {
    title: 'Employee of the Month',
    issuer: 'Performance recognition',
  },
]

export const projects = [
  {
    title: 'SaaS Token & Queue System',
    category: 'SaaS Platform',
    badge: 'Private Repo',
    desc: 'Live token and queue management system with real-time admin dashboard, Google Authenticator 2FA, reporting, and monitoring.',
    features: [
      'Live token and queue management',
      'Google Authenticator 2FA',
      'Admin dashboard and analytics',
      'Reporting and monitoring system',
    ],
    tech: ['Laravel', 'PHP', 'MySQL', 'JavaScript', 'AWS'],
  },
  {
    title: 'Appointment Booking Platform',
    category: 'Enterprise SaaS',
    badge: 'Private Repo',
    desc: 'Full appointment scheduling system with customer management, staff & payroll, subscription billing, and analytics dashboard.',
    features: [
      'Appointment scheduling',
      'Customer management',
      'Staff and payroll management',
      'Subscription and billing system',
      'Reports and analytics dashboard',
      'Automated notifications',
    ],
    tech: ['Laravel', 'PHP', 'MySQL', 'REST APIs', 'Stripe'],
  },
  {
    title: 'Payroll & HR Management',
    category: 'Internal System',
    badge: 'Private Repo',
    desc: 'Complete employee and payroll management system with attendance tracking, leave management, salary reports, and role-based access control.',
    features: [
      'Employee management',
      'Payroll processing',
      'Attendance and leave tracking',
      'Salary reports and analytics',
      'User roles and permissions',
    ],
    tech: ['PHP', 'Laravel', 'MySQL', 'JavaScript', 'Bootstrap'],
  },
  {
    title: 'WordPress Business Sites',
    category: 'WordPress & WooCommerce',
    badge: 'Multi-project',
    desc: 'Responsive business websites and WooCommerce stores built for UK clients with product catalog management and admin content management.',
    features: [
      'Responsive business website',
      'Product catalog management',
      'Admin content management',
      'Product listing and management',
      'Shopping cart functionality',
      'Order and inquiry management',
    ],
    tech: ['WordPress', 'WooCommerce', 'PHP', 'CSS3', 'jQuery'],
  },
  {
    title: 'Order Management Dashboard',
    category: 'Internal Tool',
    badge: 'Private Repo',
    desc: 'Internal order management dashboard with dispatch tracking, inventory coordination, user access management, and order status reporting.',
    features: [
      'Internal order management dashboard',
      'Dispatch and shipment tracking workflow',
      'Inventory and stock coordination',
      'User role and access management',
      'Order status tracking and reporting',
    ],
    tech: ['Laravel', 'PHP', 'MySQL', 'REST APIs', 'JavaScript'],
  },
  {
    title: 'Admin Business Operations Panel',
    category: 'Admin Platform',
    badge: 'Private Repo',
    desc: 'Comprehensive admin panel for business operations with lead management, contact and inquiry system, and professional experience tracking.',
    features: [
      'Admin panel for business operations',
      'Contact and inquiry system',
      'Client communication module',
      'Enterprise quality gates',
    ],
    tech: ['PHP', 'Laravel', 'MySQL', 'Docker', 'AWS'],
  },
]

export const projectsNote =
  'Most projects are private client engagements. All work involves full ownership — architecture, delivery, client coordination, and production support.'

export const contactCopy = {
  eyebrow: 'Contact',
  title: "Let's discuss delivery, integrations, and enterprise-grade execution.",
  subtitle:
    'Reach out directly via email, phone, or LinkedIn — fast response, clear communication. Open to leadership roles and complex PHP/WordPress/API delivery engagements.',
  responseNote: 'Typically responds within 24 hours',
  responseBody:
    'Open to leadership roles and complex PHP/WordPress/API delivery engagements. Clear communication guaranteed.',
  formTitle: 'Send a message',
  successTitle: 'Message sent successfully!',
  successBody: "I'll get back to you within 24 hours.",
}
