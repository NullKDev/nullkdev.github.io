import type { IconMap, SocialLink, Site } from '@/types'

export const AUTHOR = {
  avatar: "/static/avatar.png",
  social: {
    website: {
      href: "https://nullkdev.github.io/",
      host: "nullkdev.github.io",
      label: 'Website',
      icon: 'lucide:globe'
    },
    github: {
      href: "https://github.com/nullkdev",
      label: 'GitHub',
      icon: 'lucide:github'
    },
    linkedin: {
      href: "https://www.linkedin.com/in/jcarlos-dev/",
      label: 'LinkedIn',
      icon: 'lucide:linkedin'
    },
    rss: {
      href: "https://nullkdev.github.io/rss.xml",
      label: 'RSS',
      icon: 'lucide:rss'
    },
    email: {
      href: "mailto:carlos.alarcon.dev@gmail.com",
      mail: "carlos.alarcon.dev@gmail.com",
      label: 'Email',
      icon: 'lucide:mail'
    },
  }
}

export const SITE: Site = {
  title: 'CarlosDev',
  description:
    'CarlosDev - System Administrator and Cybersecurity Engineer sharing practical guides on Linux, Kubernetes, homelab infrastructure, and security.',
  href: 'https://nullkdev.github.io/',
  author: 'NullKDev',
  locale: 'es-PE',
  featuredPostCount: 2,
  postsPerPage: 6,
}

// Google Analytics
// Configure via environment variable: PUBLIC_GOOGLE_ANALYTICS_ID
export const ANALYTICS = {
  google: import.meta.env.PUBLIC_GOOGLE_ANALYTICS_ID || '',
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/blog',
    label: 'Blog',
  },
  {
    href: '/projects',
    label: 'Projects',
  },
  {
    href: '/tools',
    label: 'Tools',
  },
  {
    href: '/photos',
    label: 'Photos',
  },
  {
    href: '/about',
    label: 'About',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://github.com/nullkdev',
    label: 'GitHub',
  },
  {
    href: 'https://www.linkedin.com/in/jcarlos-dev/',
    label: 'LinkedIn',
  },
  {
    href: 'mailto:carlos.alarcon.dev@gmail.com',
    label: 'Email',
  },
  {
    href: '/rss.xml',
    label: 'RSS',
  },
]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  LinkedIn: 'lucide:linkedin',
  Twitter: 'lucide:twitter',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',
}