import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import {
  ArrowUpRight, MapPin, GraduationCap, Code2, Database,
  Cloud, Layers, Settings, Mail, Phone, ExternalLink,
  CheckCircle, Send, ChevronRight, Briefcase, Wrench, Download, Menu, X
} from 'lucide-react';
import './index.css';

/* ═══════════════════════════════════════════════════════════
   BRAND SVG ICONS (removed in lucide-react v1.x)
═══════════════════════════════════════════════════════════ */
const IconGithub = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-label="GitHub">
    <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.021C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const IconLinkedin = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-label="LinkedIn">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68zm1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════════════ */
function useScramble(text, trigger, delay = 0) {
  const [output, setOutput] = useState(text);
  const CHARS = '!<>-_\\/[]{}=+*^?#@$%01234ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  useEffect(() => {
    if (!trigger) { setOutput(text); return; }
    let iter = 0;
    let tid = setTimeout(() => {
      const iv = setInterval(() => {
        setOutput(text.split('').map((ch, idx) => {
          if (ch === ' ') return ' ';
          if (idx < Math.floor(iter)) return text[idx];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join(''));
        iter += 0.45;
        if (iter > text.length + 3) { clearInterval(iv); setOutput(text); }
      }, 38);
      return () => clearInterval(iv);
    }, delay * 1000);
    return () => clearTimeout(tid);
  }, [trigger, text, delay]);
  return output;
}

/* ═══════════════════════════════════════════════════════════
   ASSEMBLE TEXT — letters fly in from random positions
═══════════════════════════════════════════════════════════ */
function AssembleText({ text, inView, className = '', charDelay = 0.03, baseDelay = 0 }) {
  const chars = text.split('');
  const positions = useMemo(() =>
    chars.map(() => ({
      x: (Math.random() - 0.5) * 1400,
      y: (Math.random() - 0.5) * 700,
      rotate: (Math.random() - 0.5) * 540,
      opacity: 0,
      scale: Math.random() * 1.8 + 0.3,
    })), []); // eslint-disable-line

  return (
    <span className={className} style={{ display: 'inline-flex', flexWrap: 'wrap' }}>
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          initial={positions[i]}
          animate={inView
            ? { x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }
            : positions[i]
          }
          transition={{ duration: 0.9, delay: baseDelay + i * charDelay, type: 'spring', stiffness: 55, damping: 9 }}
          style={{ display: 'inline-block', whiteSpace: ch === ' ' ? 'pre' : 'initial' }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </motion.span>
      ))}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   SKILL CLOUD — tags fly in from random chaos
═══════════════════════════════════════════════════════════ */
const ACCENT_MAP = {
  cyan:    { bg: 'rgba(6,182,212,0.09)',   border: 'rgba(6,182,212,0.28)',   text: '#67e8f9' },
  violet:  { bg: 'rgba(139,92,246,0.09)',  border: 'rgba(139,92,246,0.28)',  text: '#c4b5fd' },
  rose:    { bg: 'rgba(244,63,94,0.09)',   border: 'rgba(244,63,94,0.28)',   text: '#fda4af' },
  emerald: { bg: 'rgba(16,185,129,0.09)',  border: 'rgba(16,185,129,0.28)', text: '#6ee7b7' },
  amber:   { bg: 'rgba(245,158,11,0.09)',  border: 'rgba(245,158,11,0.28)', text: '#fcd34d' },
  indigo:  { bg: 'rgba(99,102,241,0.09)', border: 'rgba(99,102,241,0.28)', text: '#a5b4fc' },
};

function SkillCloud({ skills, inView, color = 'cyan' }) {
  const c = ACCENT_MAP[color] || ACCENT_MAP.cyan;
  const positions = useMemo(() =>
    skills.map(() => ({
      x: (Math.random() - 0.5) * 1600,
      y: (Math.random() - 0.5) * 800,
      rotate: (Math.random() - 0.5) * 360,
      scale: 0, opacity: 0,
    })), []); // eslint-disable-line

  return (
    <div className="skill-cloud">
      {skills.map((skill, i) => (
        <motion.span
          key={skill}
          initial={positions[i]}
          animate={inView
            ? { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
            : positions[i]
          }
          transition={{ duration: 0.65, delay: i * 0.045, type: 'spring', stiffness: 65, damping: 10 }}
          whileHover={{ scale: 1.18, y: -6, rotate: (Math.random() - 0.5) * 8 }}
          className="skill-tag"
          style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
        >
          {skill}
        </motion.span>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SKILL TICKER BOARD
═══════════════════════════════════════════════════════════ */
function SkillMarqueeRow({ group, index, inView }) {
  const c = ACCENT_MAP[group.color] || ACCENT_MAP.cyan;
  const duration = 22 + index * 5;
  const reverse = index % 2 !== 0;
  const doubled = [...group.skills, ...group.skills];

  return (
    <motion.div
      className="smrow"
      initial={{ opacity: 0, x: -28 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -28 }}
      transition={{ delay: index * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="smrow__label" style={{ color: c.text }}>
        <span className="smrow__dot" style={{ background: c.text, boxShadow: `0 0 8px ${c.text}` }} />
        <span className="smrow__icon">{group.icon}</span>
        <span className="smrow__name">{group.title}</span>
        <span className="smrow__count">{group.skills.length}</span>
      </div>
      <div className="smrow__track">
        <div
          className={`smrow__inner smrow__inner--${reverse ? 'right' : 'left'}`}
          style={{ '--dur': `${duration}s` }}
        >
          {doubled.map((skill, i) => (
            <span
              key={i}
              className="smrow__tag"
              style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   3D TILT SKILL CARD
═══════════════════════════════════════════════════════════ */
function Card3D({ group, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const c = ACCENT_MAP[group.color] || ACCENT_MAP.cyan;

  return (
    <motion.div
      ref={ref}
      style={{ gridColumn: `span ${group.span || 1}` }}
      initial={{ opacity: 0, y: 70, scale: 0.88, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.75, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="sc3d"
        whileHover={{ y: -6, boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px ${c.border}` }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="sc3d__bar" style={{ background: c.text }} />

        <div className="sc3d__icon" style={{ color: c.text, background: c.bg, border: `1px solid ${c.border}` }}>
          {React.cloneElement(group.icon, { size: 22 })}
        </div>

        <h3 className="sc3d__title" style={{ color: c.text }}>{group.title}</h3>
        <p className="sc3d__count" style={{ color: c.text }}>{group.skills.length} technologies</p>

        <div className="sc3d__tags">
          {group.skills.map((skill, i) => (
            <motion.span
              key={skill}
              className="sc3d__tag"
              style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: index * 0.08 + 0.3 + i * 0.035, duration: 0.35, ease: 'easeOut' }}
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════ */
const SKILL_GROUPS = [
  { icon: <Code2 size={16}/>,     title: 'Languages',         color: 'cyan',    span: 1, skills: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++'] },
  { icon: <Layers size={16}/>,    title: 'Front-End',         color: 'violet',  span: 2, skills: ['React.js', 'Next.js', 'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'Redux', 'jQuery'] },
  { icon: <Settings size={16}/>,  title: 'Back-End',          color: 'rose',    span: 2, skills: ['Node.js', 'Express.js', 'REST APIs', 'Spring Boot', 'FastAPI'] },
  { icon: <Database size={16}/>,  title: 'Databases & ORMs',  color: 'emerald', span: 1, skills: ['MongoDB', 'MySQL', 'PostgreSQL', 'Oracle', 'SQL Server', 'Redis', 'Prisma', 'TypeORM'] },
  { icon: <Cloud size={16}/>,     title: 'Cloud & DevOps',    color: 'amber',   span: 1, skills: ['AWS', 'Vercel', 'Render', 'DigitalOcean', 'GCP', 'Git', 'GitHub', 'CI/CD'] },
  { icon: <Wrench size={16}/>,    title: 'Tools & Practices', color: 'indigo',  span: 2, skills: ['Postman', 'Jira', 'VS Code', 'IntelliJ IDEA', 'PyCharm', 'Agile', 'SDLC', 'Code Reviews', 'Debugging', 'Testing', 'SharePoint', 'MS Office'] },
];

const ACADEMIC_PROJECTS = [
  {
    category: 'Academic Project',
    title: 'DB-Git — Database Schema Version Control',
    period: 'May 2026',
    location: 'University of Windsor · Windsor, Ontario',
    tech: ['Node.js', 'TypeScript', 'MySQL', 'PostgreSQL', 'CLI', 'JSON'],
    color: '#14b8a6',
    github: 'https://github.com/bhavik41/DB_Git',
    bullets: [
      'Git-inspired CLI tool to version-control database schemas — commit, diff, log, and rollback schema changes.',
      'Captures schema snapshots with commit messages and timestamps, maintaining a full history of structural changes.',
      'Automated migration script generation from schema diffs, with support for MySQL and PostgreSQL.',
    ],
  },
  {
    category: 'Academic Project',
    title: 'AI-Powered Collaborative Coding Platform',
    period: 'Jan 2025 – Apr 2025',
    location: 'Indus University · Ahmedabad, India',
    tech: ['MongoDB', 'Node.js', 'React.js', 'Tailwind CSS', 'Socket.IO'],
    color: '#06b6d4',
    github: [
      { label: 'Frontend', url: 'https://github.com/bhavik41/collaborativeFrontend2' },
      { label: 'Backend',  url: 'https://github.com/bhavik41/collaborativeBackend2' },
    ],
    bullets: [
      'Scalable real-time collaborative coding platform using MERN stack with role-based auth & multi-user project management.',
      'Socket.IO integration enabling synchronized editing, live chat, and instant project updates for concurrent users.',
      'Client/server workflows supporting 50+ concurrent users with sub-50ms synchronization latency.',
      'Debugging, testing, and performance optimization within Agile development cycles.',
    ],
  },
];

const PERSONAL_PROJECTS = [
  {
    category: 'Personal Project',
    title: 'SportSlot — Sports Venue Booking Platform',
    period: 'Jun 2026',
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'JWT', 'REST APIs'],
    color: '#f97316',
    github: [
      { label: 'Frontend', url: 'https://github.com/bhavik41/sportvenueFrontend' },
      { label: 'Backend',  url: 'https://github.com/bhavik41/sportsvenueBackend' },
    ],
    bullets: [
      'Two-sided marketplace bridging venue owners and players — owners list underutilized slots at competitive rates, cutting revenue loss from empty courts while giving players access to 30–50% cheaper bookings.',
      'Dynamic time-slot engine with real-time availability calendar, conflict-free double-booking prevention, and owner-controlled peak/off-peak pricing and promotional offers.',
      'Dual-dashboard system: owners manage listings, track upcoming reservations, and run slot-level discounts; clients browse, book, cancel, and view full booking history — backed by 20+ REST API endpoints.',
    ],
  },
  {
    category: 'Personal Project',
    title: 'VaultShare — Secured File Sharing System',
    period: 'Jun 2025',
    tech: ['TypeScript', 'React.js', 'Node.js', 'Express.js', 'Redux Toolkit', 'Tailwind CSS', 'JWT', '2FA (TOTP)'],
    color: '#6366f1',
    github: [
      { label: 'Frontend', url: 'https://github.com/bhavik41/VaultShareFrontened' },
      { label: 'Backend',  url: 'https://github.com/bhavik41/VaultShareBackend' },
    ],
    bullets: [
      'Full-stack secure file sharing platform with AES encryption for stored files and SHA-256 hashing for integrity verification.',
      'JWT auth with refresh token rotation, TOTP-based two-factor authentication via QR code, and password reset via Nodemailer.',
      'File upload/download with Multer, shareable links, role-based access control, team invitations, and 15+ REST API endpoints.',
    ],
  },
  {
    category: 'Personal Project',
    title: 'CampusRide — Student Ride-Sharing Platform',
    period: 'Jun 2026',
    tech: ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Zustand', 'Node.js', 'Express', 'Prisma', 'SQLite', 'JWT', 'Zod'],
    color: '#22c55e',
    github: 'https://github.com/bhavik41/campusride',
    bullets: [
      'Full-stack ride-sharing platform like Poparide, supporting both long-distance intercity rides and short campus rides exclusive to verified students.',
      'Student verification via .edu email detection or university profile — unlocks campus ride posting and booking with JWT-secured auth.',
      'Complete booking system with seat management, cancellation, driver dashboard, and passenger details; Zod-validated REST API with Prisma ORM.',
    ],
  },
  {
    category: 'Personal Project',
    title: 'Slack Lite — Real-Time Messenger',
    period: 'May 2025',
    tech: ['React.js', 'Node.js', 'Express.js', 'Socket.IO', 'MongoDB'],
    color: '#f59e0b',
    github: null,
    bullets: [
      'Full-stack real-time messaging app with 1:1 and group chat rooms persisted in MongoDB.',
      'Socket.IO for instant message delivery, online/offline presence indicators, and live typing notifications.',
      'Node.js + Express REST API with Mongoose schemas and full message history on reconnect.',
    ],
  },
  {
    category: 'Personal Project',
    title: 'Virtual OS — Browser Desktop Environment',
    period: 'Apr 2025',
    tech: ['React.js', 'Zustand', 'react-rnd', 'JavaScript', 'CSS3'],
    color: '#06b6d4',
    github: null,
    bullets: [
      'Interactive browser-based desktop OS with draggable, resizable multi-window management via react-rnd.',
      'Zustand store managing window lifecycle — open, minimize, maximize, close — across all sandboxed apps.',
      'Modular app architecture enabling seamless addition of new desktop applications without core changes.',
    ],
  },
  {
    category: 'Personal Project',
    title: 'Diet Plan Recommendation System',
    period: 'Oct 2024 – Nov 2024',
    tech: ['MongoDB', 'Node.js', 'React.js', 'Tailwind CSS', 'OpenAI API'],
    color: '#a855f7',
    github: 'https://github.com/bhavik41/diet_plan',
    bullets: [
      'Personalized meal plans by analyzing user health goals, dietary restrictions, and food preferences.',
      'Prompt engineering techniques to improve accuracy of AI-driven nutritional recommendations.',
      'Comprehensive nutrient breakdowns, meal notes, and guidelines — nutritional database with 500+ food items.',
    ],
  },
  {
    category: 'Personal Project',
    title: 'Voice GPT',
    period: 'Apr 2023 – May 2023',
    tech: ['HTML', 'CSS', 'GPT API', 'Google Vision'],
    color: '#f43f5e',
    github: 'https://github.com/bhavik41/Voice-GPT',
    bullets: [
      'Web app enabling voice-powered interactions with GPT, supporting voice search and text-to-speech responses.',
      'Real-time voice input with automated audio output for a seamless conversational UX.',
      'Built before GPT\'s native TTS — demonstrating early adoption of AI-driven voice interfaces.',
    ],
  },
];

const CLIENT_WORK = [
  {
    title: 'Gas Cylinder Management Website',
    company: 'Guru Industries',
    location: 'Palanpur, Banaskantha, India',
    period: 'Apr 2026 – May 2026',
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs'],
    color: '#6366f1',
    bullets: [
      'Full-stack platform to manage gas cylinder inventory, distribution, and customer delivery records.',
      'Real-time cylinder tracking — issued, returned, and in-stock counts — with low-stock alerts.',
      'Customer management portal with order history, deposit tracking, and delivery scheduling.',
      'Automated reporting for daily dispatch logs and cylinder usage analytics.',
    ],
  },
  {
    title: 'Invoice & Billing Management System',
    company: 'Shreeji Bio Fuel',
    location: 'Palanpur, Banaskantha, India',
    period: 'Mar 2026 – Apr 2026',
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'PDF Generation'],
    color: '#f59e0b',
    bullets: [
      'End-to-end billing platform for managing client invoices, payment tracking, and financial records.',
      'Automated PDF invoice generation with company branding, itemized breakdowns, and tax calculations.',
      'Dashboard with real-time revenue analytics, outstanding payment alerts, and invoice status tracking.',
      'Role-based access for admin and staff with secure authentication and audit trail logging.',
    ],
  },
  {
    title: 'Gym E-Commerce Website',
    company: 'Iron Forge',
    location: 'Ahmedabad, India',
    period: 'Jan 2026 – Feb 2026',
    tech: ['React.js', 'Express.js', 'MongoDB', 'JavaScript', 'REST APIs'],
    color: '#10b981',
    bullets: [
      'Collaborated with client to gather requirements, refine features, and deliver user-focused software.',
      'Scalable e-commerce platform with authentication, product management, cart, and order processing.',
      'Designed and integrated 10+ RESTful APIs for secure user auth and product workflows.',
      'Built responsive React.js interfaces with optimized MongoDB schema design.',
    ],
  },
];

const WORK_EXPERIENCE = [
  {
    title: 'Full-Stack Software Engineer',
    company: 'Shreeji Info Tech',
    location: 'Ahmedabad, India',
    period: 'Sep 2024 – Aug 2025',
    tech: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'JavaScript', 'REST APIs'],
    color: '#f59e0b',
    bullets: [
      'Engineered and shipped 6+ production-grade web applications end-to-end using the MERN stack, serving 500+ active users across client industries.',
      'Architected 25+ RESTful API endpoints with Node.js and Express; optimized MongoDB queries and indexing, cutting average response time by ~35%.',
      'Built pixel-perfect React.js frontends with reusable component libraries, reducing UI development time by 40% on subsequent projects.',
      'Led debugging and code review cycles that eliminated 3 critical production bugs and improved overall codebase maintainability.',
    ],
  },
  {
    title: 'MERN Stack Developer Intern',
    company: 'Freshers Booth',
    location: 'Ahmedabad, India',
    period: 'Jun 2024 – Aug 2024',
    tech: ['React.js', 'Express.js', 'JavaScript', 'HTML', 'CSS', 'APIs'],
    color: '#06b6d4',
    bullets: [
      'Developed and maintained responsive full-stack app features using React.js, Express.js, and REST APIs.',
      'Integrated Google Auth, Google Gemini, and LinkedIn APIs into authentication pipelines.',
      'Debugging, testing, code reviews, and troubleshooting to improve quality and maintainability.',
      'Feature planning and collaborative delivery within Agile sprint cycles.',
    ],
  },
];

const EDUCATION = [
  {
    degree: 'Master of Applied Computing',
    school: 'University of Windsor',
    location: 'Windsor, Ontario',
    period: 'Aug 2025 – Present',
    gpa: '3.1 / 4',
    note: 'Available for 4 or 8-month co-op starting Sep 2026',
    status: 'current',
  },
  {
    degree: 'B.Sc. in Computer Science & Engineering',
    school: 'Indus Institute of Technology & Engineering',
    location: 'Ahmedabad, India',
    period: 'Jul 2021 – May 2025',
    gpa: '9.46 / 10',
    status: 'done',
  },
];

/* ═══════════════════════════════════════════════════════════
   3D SCROLL WRAPPER
═══════════════════════════════════════════════════════════ */
function Section3D({ children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.95', 'start 0.2'],
  });

  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [18, 0]),
    { stiffness: 80, damping: 22 }
  );
  const scale = useSpring(
    useTransform(scrollYProgress, [0, 1], [0.93, 1]),
    { stiffness: 80, damping: 22 }
  );
  const opacity = useTransform(scrollYProgress, [0, 0.45], [0, 1]);
  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [60, 0]),
    { stiffness: 80, damping: 22 }
  );

  return (
    <div ref={ref} className="s3d-wrapper">
      <motion.div className="s3d-inner" style={{ rotateX, scale, opacity, y, transformOrigin: 'center 85%' }}>
        {children}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   NAV
═══════════════════════════════════════════════════════════ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 36);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const links = [
    { label: 'Skills', id: 'skills' },
    { label: 'Projects', id: 'projects' },
    { label: 'Client Work', id: 'client-work' },
    { label: 'Experience', id: 'experience' },
    { label: 'Edu', id: 'education' },
  ];

  const close = () => setMobileOpen(false);

  return (
    <motion.header
      className={`nav${scrolled ? ' nav--scrolled' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="nav__inner">
        <a href="#hero" className="nav__brand">BT<span className="nav__dot">.</span></a>
        <nav className="nav__links">
          {links.map((l, i) => (
            <motion.a key={l.id} href={`#${l.id}`} className="nav__link"
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
              whileHover={{ color: '#67e8f9' }}
            >{l.label}</motion.a>
          ))}
        </nav>
        <motion.a href="#contact" className="nav__cta nav__cta--desktop"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
          whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}>
          Hire Me <ArrowUpRight size={13} />
        </motion.a>
        <button className="nav__hamburger" onClick={() => setMobileOpen(o => !o)} aria-label="Toggle menu">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav className="nav__mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            {links.map(l => (
              <a key={l.id} href={`#${l.id}`} className="nav__mobile-link" onClick={close}>{l.label}</a>
            ))}
            <a href="#contact" className="nav__mobile-cta" onClick={close}>Hire Me <ArrowUpRight size={12}/></a>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ═══════════════════════════════════════════════════════════
   3D ASSEMBLE CUBE
═══════════════════════════════════════════════════════════ */
function AssembleCube({ scrollY }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-40px' });
  const rotateX = useTransform(scrollY, [0, 800], [25, 180]);
  const rotateY = useTransform(scrollY, [0, 800], [35, -180]);
  
  // The 6 faces of the cube with their assembled and scattered states
  const faces = [
    { name: 'front',  assembled: { z: 100, x: 0, y: 0, rotateX: 0, rotateY: 0, rotateZ: 0, opacity: 1 }, scattered: { z: 800, x: 400, y: -400, rotateX: 180, rotateY: 90, rotateZ: 45, opacity: 0 } },
    { name: 'back',   assembled: { z: -100, x: 0, y: 0, rotateX: 0, rotateY: 180, rotateZ: 0, opacity: 1 }, scattered: { z: -800, x: -400, y: 400, rotateX: -180, rotateY: -90, rotateZ: -45, opacity: 0 } },
    { name: 'right',  assembled: { x: 100, y: 0, z: 0, rotateX: 0, rotateY: 90, rotateZ: 0, opacity: 1 }, scattered: { x: 800, y: 400, z: 400, rotateX: 90, rotateY: 180, rotateZ: 90, opacity: 0 } },
    { name: 'left',   assembled: { x: -100, y: 0, z: 0, rotateX: 0, rotateY: -90, rotateZ: 0, opacity: 1 }, scattered: { x: -800, y: -400, z: -400, rotateX: -90, rotateY: -180, rotateZ: -90, opacity: 0 } },
    { name: 'top',    assembled: { y: -100, x: 0, z: 0, rotateX: 90, rotateY: 0, rotateZ: 0, opacity: 1 }, scattered: { y: -800, x: 400, z: -400, rotateX: 180, rotateY: 90, rotateZ: 180, opacity: 0 } },
    { name: 'bottom', assembled: { y: 100, x: 0, z: 0, rotateX: -90, rotateY: 0, rotateZ: 0, opacity: 1 }, scattered: { y: 800, x: -400, z: 400, rotateX: -180, rotateY: -90, rotateZ: -180, opacity: 0 } },
  ];

  return (
    <div className="cube-wrapper" ref={ref}>
      <motion.div className="cube" style={{ rotateX, rotateY }}
        animate={{ y: [-15, 15, -15] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
        
        {/* Outer Assembling Faces */}
        {faces.map((f, i) => (
          <motion.div key={f.name} className={`cube__face cube__face--${f.name}`}
            initial={f.scattered}
            animate={inView ? f.assembled : f.scattered}
            transition={{ duration: 1.4, delay: i * 0.12, type: 'spring', stiffness: 35, damping: 11 }}
          >
            <div className="cube__face-inner" />
            <div className="cube__face-cross" />
          </motion.div>
        ))}

        {/* Inner Glowing Core */}
        <motion.div className="cube__core"
          animate={{ rotateX: [0, 360], rotateY: [0, -360], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          {faces.map((f) => (
             <div key={`core-${f.name}`} className={`core__face core__face--${f.name}`} />
          ))}
        </motion.div>

      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════ */
const ROLES = ['Full-Stack Developer', 'MERN Stack Engineer', 'Real-Time Systems Builder', 'TypeScript Architect'];

function Hero() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-40px' });
  const [roleIdx, setRoleIdx] = useState(0);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -90]);
  const opacity = useTransform(scrollY, [0, 380], [1, 0]);
  const scrambledRole = useScramble(ROLES[roleIdx], true);

  useEffect(() => {
    const t = setInterval(() => setRoleIdx(i => (i + 1) % ROLES.length), 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.section id="hero" className="hero" ref={ref} style={{ opacity: opacity }}>
      <div className="hero__bg-grid" />
      <div className="hero__orb hero__orb--1" />
      <div className="hero__orb hero__orb--2" />
      <div className="hero__orb hero__orb--3" />

      <div className="hero__content-layout">
        <div className="hero__inner" style={{ transform: `translateY(${y.get()}px)` }}>
        <motion.div className="hero__pill"
          initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <span className="hero__pulse" /> Available · Internship Sep 2026
        </motion.div>

        <h1 className="hero__name">
          <AssembleText text="BHAVIK" inView={inView} className="hero__name-line hero__name-first" charDelay={0.04} baseDelay={0.1} />
          <AssembleText text="THUMBADIYA" inView={inView} className="hero__name-line hero__name-last" charDelay={0.03} baseDelay={0.45} />
        </h1>

        <div className="hero__role">
          <span className="hero__role-slash">// </span>
          <AnimatePresence mode="wait">
            <motion.span key={roleIdx} className="hero__role-text"
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.28 }}>
              {scrambledRole}
              <span className="hero__cursor">█</span>
            </motion.span>
          </AnimatePresence>
        </div>

        <motion.p className="hero__bio"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}>
          Full-stack developer building scalable MERN applications, real-time collaborative platforms,
          and high-performance APIs. Skilled in Agile teams, cloud deployments, and clean architecture.
        </motion.p>

        <motion.div className="hero__meta"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
          <span><MapPin size={12}/> Windsor, Ontario</span>
          <span className="hero__meta-sep">·</span>
          <span><GraduationCap size={12}/> MAC · UWindsor · 3.1 GPA</span>
          <span className="hero__meta-sep">·</span>
          <span>B.Sc. CS · 9.46/10</span>
        </motion.div>

        <motion.div className="hero__ctas"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.65 }}>
          <motion.a href="#projects" className="cta cta--primary" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            View Projects <ChevronRight size={14}/>
          </motion.a>
          <motion.a href="/resume.pdf" download className="cta cta--ghost" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Download size={14}/> Resume
          </motion.a>
          <motion.a href="https://github.com/bhavik41" target="_blank" rel="noreferrer" className="cta cta--ghost" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <IconGithub size={14}/> GitHub
          </motion.a>
          <motion.a href="https://linkedin.com/in/bhavik-thumbadiya-192868272" target="_blank" rel="noreferrer" className="cta cta--ghost" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <IconLinkedin size={14}/> LinkedIn
          </motion.a>
        </motion.div>
      </div>

      <div className="hero__visual">
        <AssembleCube scrollY={scrollY} />
      </div>
      </div>

      {/* floating stats */}
      <motion.div className="hero__stats"
        initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.8, duration: 0.7 }}>
        {[
          { v: '50+',   l: 'Concurrent Users' },
          { v: '7+',    l: 'Projects Shipped' },
          { v: '10+',   l: 'REST APIs Built' },
          { v: '3.1',   l: 'Master GPA' },
        ].map(s => (
          <div key={s.l} className="hero__stat">
            <span className="hero__stat-val">{s.v}</span>
            <span className="hero__stat-lbl">{s.l}</span>
          </div>
        ))}
      </motion.div>

      {/* 3D perspective floor grid */}
      <div className="hero__floor-outer">
        <div className="hero__floor-grid" />
      </div>
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SKILL NETWORK (Interactive Constellation)
═══════════════════════════════════════════════════════════ */
function SkillNetwork() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-100px' });
  const [hovered, setHovered] = useState(null);

  const CAT_RADIUS = 160;
  const SKILL_RADIUS = 140;

  // Build nodes and links
  const centerNode = { id: 'root', label: 'TECH STACK', type: 'center', x: 0, y: 0, color: 'cyan' };
  const nodes = [centerNode];
  const links = [];

  SKILL_GROUPS.forEach((group, i) => {
    const angle = (i / SKILL_GROUPS.length) * Math.PI * 2;
    const cx = Math.cos(angle) * CAT_RADIUS;
    const cy = Math.sin(angle) * CAT_RADIUS;
    
    const catNode = { id: group.title, label: group.title, type: 'category', x: cx, y: cy, color: group.color };
    nodes.push(catNode);
    links.push({ source: centerNode, target: catNode, color: group.color });

    // Dynamic arc spread to prevent overlapping of labels
    const arcSpread = Math.min(Math.PI * 1.6, group.skills.length * 0.35); // Max 280 degrees
    const arcStart = angle - arcSpread / 2;
    const arcEnd = angle + arcSpread / 2;

    group.skills.forEach((skill, j) => {
      const step = group.skills.length > 1 ? (arcEnd - arcStart) / (group.skills.length - 1) : 0;
      const skillAngle = arcStart + j * step;
      
      // Stagger distance significantly to avoid text collisions
      const dist = SKILL_RADIUS + (j % 2 === 0 ? 0 : 45);
      const sx = cx + Math.cos(skillAngle) * dist;
      const sy = cy + Math.sin(skillAngle) * dist;

      const skillNode = { id: skill, label: skill, type: 'skill', x: sx, y: sy, color: group.color, parentId: group.title };
      nodes.push(skillNode);
      links.push({ source: catNode, target: skillNode, color: group.color });
    });
  });

  return (
    <div className="skill-network" ref={ref}>
      <motion.div className="skill-network__inner"
        animate={{ rotate: 360, scale: 0.9 }}
        transition={{ rotate: { duration: 160, repeat: Infinity, ease: 'linear' } }}
      >
        <svg className="skill-network__svg" viewBox="-600 -600 1200 1200">
          {links.map((link, i) => {
            const isDimmed = hovered && hovered !== link.target.id && hovered !== link.source.id && hovered !== link.target.parentId && hovered !== 'root';
            return (
              <motion.line key={i}
                x1={link.source.x} y1={link.source.y} x2={link.target.x} y2={link.target.y}
                className="skill-network__link"
                style={{ stroke: `var(--${link.color})` }}
                strokeWidth={link.target.type === 'category' ? 3 : 1}
                strokeOpacity={isDimmed ? 0.05 : 0.4}
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 1.5, delay: 0.3 + i * 0.02 }}
              />
            );
          })}
        </svg>

        {nodes.map((node, i) => {
          const isDimmed = hovered && hovered !== 'root' && hovered !== node.id && hovered !== node.parentId && !(node.type === 'category' && nodes.find(n => n.id === hovered)?.parentId === node.id);
          
          return (
            <motion.div key={node.id} 
              className={`network-node network-node--${node.type} ${isDimmed ? 'network-node--dimmed' : ''}`}
              style={{ 
                left: `calc(50% + ${node.x}px)`, 
                top: `calc(50% + ${node.y}px)`,
                '--node-color': `var(--${node.color})`,
              }}
              initial={{ scale: 0, opacity: 0, x: "-50%", y: "-50%" }}
              animate={inView ? { scale: 1, opacity: 1, x: "-50%", y: "-50%" } : { scale: 0, opacity: 0, x: "-50%", y: "-50%" }}
              transition={{ type: 'spring', delay: 0.1 + i * 0.03, stiffness: 60 }}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <motion.div className="network-node__label"
                animate={{ rotate: -360 }}
                transition={{ duration: 160, repeat: Infinity, ease: 'linear' }}
              >
                {node.label}
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SKILLS SECTION
═══════════════════════════════════════════════════════════ */
function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-80px' });
  const label = useScramble('TECHNICAL SKILLS', inView, 0.05);

  return (
    <section id="skills" className="section" ref={ref}>
      <div className="section__inner">
        <div className="section__head">
          <motion.span className="section__label" animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}>{label}</motion.span>
          <motion.h2 className="section__title" animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }} transition={{ delay: 0.1 }}>
            Technologies <span className="text-gradient">I work with</span>
          </motion.h2>
          <motion.p className="section__sub" animate={inView ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 0.2 }}>
            Hover any card for a 3D tilt effect.
          </motion.p>
        </div>
        <div className="skills-bento">
          {SKILL_GROUPS.map((g, i) => <Card3D key={g.title} group={g} index={i} />)}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROJECT CARD
═══════════════════════════════════════════════════════════ */
function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [hov, setHov] = useState(false);

  return (
    <motion.article
      ref={ref}
      className="pcard"
      style={{ '--accent': project.color }}
      initial={{ opacity: 0, y: 70, scale: 0.9, filter: 'blur(5px)' }}
      animate={inView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.72, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div className="pcard__glow" style={{ opacity: hov ? 0.14 : 0.05 }} />
      <div className="pcard__top-bar" />
      <div className="pcard__meta">
        <span className="pcard__category">{project.category}</span>
        <span className="pcard__period">{project.period}</span>
      </div>
      <h3 className="pcard__title">{project.title}</h3>
      {project.location && <p className="pcard__location">{project.location}</p>}
      <div className="pcard__tech">
        {project.tech.map(t => (
          <span key={t} className="pcard__tech-tag">{t}</span>
        ))}
      </div>
      <ul className="pcard__bullets">
        {project.bullets.map((b, i) => (
          <li key={i}>
            <span className="pcard__dot" />
            {b}
          </li>
        ))}
      </ul>
      {project.github && (
        Array.isArray(project.github) ? (
          <div className="pcard__github-row">
            {project.github.map(g => (
              <a key={g.url} href={g.url} target="_blank" rel="noreferrer" className="pcard__github">
                <IconGithub size={12} /> {g.label} <ExternalLink size={10} />
              </a>
            ))}
          </div>
        ) : (
          <a href={project.github} target="_blank" rel="noreferrer" className="pcard__github">
            <IconGithub size={12} /> View Code <ExternalLink size={10} />
          </a>
        )
      )}
    </motion.article>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROJECTS SECTION
═══════════════════════════════════════════════════════════ */
function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-80px' });
  const label = useScramble('PORTFOLIO', inView, 0.05);

  return (
    <section id="projects" className="section section--alt" ref={ref}>
      <div className="section__inner">
        <div className="section__head">
          <motion.span className="section__label" animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}>{label}</motion.span>
          <motion.h2 className="section__title" animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }} transition={{ delay: 0.1 }}>
            Projects
          </motion.h2>
        </div>
        
        <div style={{ marginBottom: '60px' }}>
          <h3 className="section__sub-heading" style={{ marginBottom: '24px', fontSize: '20px', color: '#06b6d4' }}>Academic Projects</h3>
          <div className="projects__grid">
            {ACADEMIC_PROJECTS.map((p, i) => <ProjectCard key={p.title} project={p} index={i} />)}
          </div>
        </div>

        <div>
          <h3 className="section__sub-heading" style={{ marginBottom: '24px', fontSize: '20px', color: '#a855f7' }}>Personal Projects</h3>
          <div className="projects__grid">
            {PERSONAL_PROJECTS.map((p, i) => <ProjectCard key={p.title} project={p} index={i} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CLIENT WORK
═══════════════════════════════════════════════════════════ */
function ClientWork() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-80px' });
  const label = useScramble('FREELANCE & CONTRACT', inView, 0.05);

  return (
    <section id="client-work" className="section" ref={ref}>
      <div className="section__inner">
        <div className="section__head">
          <motion.span className="section__label" animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}>{label}</motion.span>
          <motion.h2 className="section__title" animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }} transition={{ delay: 0.1 }}>
            Client Work
          </motion.h2>
        </div>
        <div className="exp__list">
          {CLIENT_WORK.map((e, i) => <ExpCard key={e.title} item={e} index={i} />)}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXPERIENCE
═══════════════════════════════════════════════════════════ */
function ExpCard({ item, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.article
      ref={ref}
      className="ecard"
      style={{ '--accent': item.color }}
      initial={{ opacity: 0, x: -60, filter: 'blur(5px)' }}
      animate={inView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
    >
      <div className="ecard__accent" />
      <div className="ecard__top">
        <div>
          <span className="ecard__badge">{item.badge}</span>
          <h3 className="ecard__title">{item.title}</h3>
          <p className="ecard__company">{item.company} · {item.location}</p>
        </div>
        <span className="ecard__period">{item.period}</span>
      </div>
      <div className="ecard__tech">
        {item.tech.map(t => <span key={t} className="ecard__tag">{t}</span>)}
      </div>
      <ul className="ecard__bullets">
        {item.bullets.map((b, i) => (
          <li key={i}>
            <span className="ecard__dot" />
            {b}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

function EduCard({ edu, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      className={`educard${edu.status === 'current' ? ' educard--current' : ''}`}
      initial={{ opacity: 0, y: 60, scale: 0.88, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5 }}
    >
      <span className="educard__badge">{edu.status === 'current' ? '● CURRENT' : '✓ COMPLETED'}</span>
      <h3 className="educard__degree">{edu.degree}</h3>
      <p className="educard__school">{edu.school}</p>
      <p className="educard__location">{edu.location}</p>
      <div className="educard__footer">
        <span className="educard__period">{edu.period}</span>
        <span className="educard__gpa">GPA: {edu.gpa}</span>
      </div>
      {edu.note && <p className="educard__note">{edu.note}</p>}
    </motion.div>
  );
}

function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-80px' });
  const label = useScramble('PROFESSIONAL EXPERIENCE', inView, 0.05);

  return (
    <section id="experience" className="section section--alt" ref={ref}>
      <div className="section__inner">
        <div className="section__head">
          <motion.span className="section__label" animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}>{label}</motion.span>
          <motion.h2 className="section__title" animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }} transition={{ delay: 0.1 }}>
            Work Experience
          </motion.h2>
        </div>
        <div className="exp__list">
          {WORK_EXPERIENCE.map((e, i) => <ExpCard key={e.title} item={e} index={i} />)}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   EDUCATION
═══════════════════════════════════════════════════════════ */
function EducationSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-80px' });
  const label = useScramble('ACADEMICS', inView, 0.05);

  return (
    <section id="education" className="section" ref={ref}>
      <div className="section__inner">
        <div className="section__head">
          <motion.span className="section__label" animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}>{label}</motion.span>
          <motion.h2 className="section__title" animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }} transition={{ delay: 0.1 }}>
            Education
          </motion.h2>
        </div>
        <div className="edu__grid">
          {EDUCATION.map((e, i) => <EduCard key={e.degree} edu={e} index={i} />)}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CONTACT
═══════════════════════════════════════════════════════════ */
function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-80px' });
  const label = useScramble('GET IN TOUCH', inView, 0.05);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1400);
  };

  const LINKS = [
    { icon: <Mail size={15}/>,        label: 'Email',    val: 'bhavikpatel73241@gmail.com', href: 'mailto:bhavikpatel73241@gmail.com' },
    { icon: <Phone size={15}/>,       label: 'Phone',    val: '+1 (647) 382-0767',          href: 'tel:+16473820767' },
    { icon: <IconGithub size={15}/>,  label: 'GitHub',   val: 'github.com/bhavik41',        href: 'https://github.com/bhavik41',                              ext: true },
    { icon: <IconLinkedin size={15}/>,label: 'LinkedIn', val: 'Bhavik Thumbadiya',           href: 'https://linkedin.com/in/bhavik-thumbadiya-192868272',     ext: true },
    { icon: <MapPin size={15}/>,      label: 'Location', val: 'Windsor, Ontario, Canada' },
  ];

  return (
    <section id="contact" className="section section--alt" ref={ref}>
      <div className="section__inner">
        <div className="section__head">
          <motion.span className="section__label" animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}>{label}</motion.span>
          <motion.h2 className="section__title" animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }} transition={{ delay: 0.1 }}>
            Let's build something great
          </motion.h2>
          <motion.p className="section__sub" animate={inView ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 0.2 }}>
            Available for 4 or 8-month internships starting September 2026.
          </motion.p>
        </div>

        <div className="contact__grid">
          <motion.div className="contact__info"
            initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }} transition={{ delay: 0.2 }}>
            {LINKS.map((l, i) => (
              <motion.a key={l.label} className="clink"
                href={l.href || '#'}
                target={l.ext ? '_blank' : undefined}
                rel={l.ext ? 'noreferrer' : undefined}
                style={!l.href ? { pointerEvents: 'none' } : {}}
                initial={{ opacity: 0, x: -18 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -18 }}
                transition={{ delay: 0.28 + i * 0.08 }}
                whileHover={{ x: 9 }}>
                <span className="clink__icon">{l.icon}</span>
                <div>
                  <span className="clink__label">{l.label}</span>
                  <span className="clink__val">{l.val}</span>
                </div>
                {l.ext && <ExternalLink size={11} className="clink__ext"/>}
              </motion.a>
            ))}
          </motion.div>

          <motion.div className="contact__form-wrap"
            initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }} transition={{ delay: 0.28 }}>
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="ok" className="form-ok"
                  initial={{ scale: 0.82, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 180, damping: 16 }}>
                  <CheckCircle size={52} color="#10b981"/>
                  <h3>Message sent!</h3>
                  <p>Thanks for reaching out. I'll reply as soon as possible.</p>
                  <button className="btn-ghost-sm" onClick={() => setSent(false)}>Send another</button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h3 className="form__title">Send a message</h3>
                  {[
                    { k: 'name',  l: 'Name',  t: 'text',  ph: 'Your name' },
                    { k: 'email', l: 'Email', t: 'email', ph: 'you@company.com' },
                  ].map(f => (
                    <div key={f.k} className="form__field">
                      <label>{f.l}</label>
                      <input type={f.t} placeholder={f.ph} value={form[f.k]}
                        onChange={e => setForm({ ...form, [f.k]: e.target.value })} required />
                    </div>
                  ))}
                  <div className="form__field">
                    <label>Message</label>
                    <textarea rows={4} placeholder="Tell me about the opportunity..."
                      value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
                  </div>
                  <motion.button type="submit" className="form__submit"
                    disabled={sending}
                    style={{ opacity: sending ? 0.65 : 1, cursor: sending ? 'not-allowed' : 'pointer' }}
                    whileHover={!sending ? { scale: 1.02 } : {}}
                    whileTap={!sending ? { scale: 0.98 } : {}}>
                    {sending ? 'Sending...' : <><Send size={13}/> Send Message</>}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <span className="footer__brand">BT.</span>
        <p className="footer__copy">© 2026 Bhavik Thumbadiya · Full-Stack Software Developer · Windsor, Ontario</p>
        <div className="footer__links">
          <a href="https://github.com/bhavik41" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://linkedin.com/in/bhavik-thumbadiya-192868272" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="mailto:bhavikpatel73241@gmail.com">Email</a>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════════════ */
export default function App() {
  return (
    <div className="app">
      <div className="app__bg-grid" />
      <Nav />
      <Hero />
      <Section3D><Skills /></Section3D>
      <Section3D><Projects /></Section3D>
      <Section3D><ClientWork /></Section3D>
      <Section3D><Experience /></Section3D>
      <Section3D><EducationSection /></Section3D>
      <Section3D><Contact /></Section3D>
      <Footer />
    </div>
  );
}
