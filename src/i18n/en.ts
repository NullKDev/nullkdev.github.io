export const en = {
  // Navigation
  'nav.blog': 'Blog',
  'nav.projects': 'Projects',
  'nav.tools': 'Tools',
  'nav.photos': 'Photos',
  'nav.about': 'About',

  // Common
  'common.skip_content': 'Skip to main content',
  'common.toggle_theme': 'Toggle theme',
  'common.toggle_menu': 'Toggle menu',
  'common.search': 'Search',
  'common.search_title': 'Search (⌘K)',
  'common.search_aria': 'Search blog posts',
  'common.available': 'Available for opportunities',
  'common.page': 'Page',

  // Homepage
  'home.subtitle': 'Software Developer.',
  'home.cta_blog': 'Read guides',
  'home.cta_about': 'Learn more',
  'home.core_stack': 'Core Stack',
  'home.latest_posts': 'Latest Posts',
  'home.latest_posts_desc': 'Recent guides and tutorials',
  'home.view_all': 'View all',
  'home.view_all_posts': 'View all posts',
  'home.explore': 'Explore',
  'home.about_title': 'About',
  'home.about_desc':
    'Experience, skills, and background in system administration and security',
  'home.about_cta': 'Learn more',
  'home.projects_title': 'Projects',
  'home.projects_desc':
    'Infrastructure setups, homelab experiments, and technical write-ups',
  'home.projects_cta': 'Explore',
  'home.connect_title': "Let's connect",
  'home.connect_desc':
    'Open to discussing infrastructure projects, security challenges, or sharing homelab experiences.',
  'home.send_email': 'Send email',
  'home.view_experience': 'View experience',

  // About page
  'about.job_badge': 'Mobile Developer',
  'about.country_badge': 'Peru',
  'about.years_exp': 'years of experience',
  'about.contact_btn': 'Contact me',
  'about.about_heading': 'About me',
  'about.bio_p1':
    "Hi! I'm a <strong>mobile developer</strong> with over {yearsExp} years of experience building innovative applications. I currently work at <strong>Corporativo Overall</strong>, where I drive the growth and development of mobile initiatives.",
  'about.bio_p2':
    'I specialize in <strong>native Android development</strong> using modern technologies like <strong>Kotlin</strong>, <strong>Java</strong>, <strong>Flutter</strong>, and <strong>Kotlin Multiplatform</strong>. My ability to learn new technologies allows me to stay up to date with market trends and ensure success in mobile development.',
  'about.bio_p3':
    "Beyond mobile, I also have skills in <strong>Python</strong>, <strong>Laravel</strong>, database administration, and more. I'm always looking for opportunities to collaborate with dynamic teams on projects that transform and improve the user experience.",
  'about.stack_title': 'Core Stack',
  'about.arch_title': 'Architectures',
  'about.exp_heading': 'Experience',
  'about.exp_desc':
    '{yearsExp}+ years in mobile development across Android, Flutter and multiplatform technologies',
  'about.origin_title': 'Why NullKDev?',
  'about.origin_desc':
    "The name <strong>NullKDev</strong> represents my identity as a developer: <strong>Null</strong> for the fundamental concept in programming, <strong>K</strong> for <strong>Kotlin</strong> (my favorite language) and also for <strong>Karl</strong>, and <strong>Dev</strong> for developer. It's my way of expressing my passion for clean code and elegant solutions.",

  // 404 page
  'error.title': '404: Page not found',
  'error.desc': "Oops! The page you're looking for doesn't exist.",
  'error.go_home': 'Go to home page',

  // Tools page
  'tools.heading': 'Tools',
  'tools.desc':
    'Free online tools for system administrators, developers, and IT professionals.',
  'tools.password_gen': 'Password Generator',
  'tools.password_desc': 'Generate secure passwords and check strength',
  'tools.subnet_calc': 'Subnet Calculator',
  'tools.subnet_desc': 'Calculate subnet masks and network addresses',
  'tools.ip_dns': 'IP & DNS Lookup',
  'tools.ip_dns_desc': 'Lookup IP geolocation and DNS records',
  'tools.base64': 'Base64 Encoder & Decoder',
  'tools.base64_desc': 'Encode and decode Base64 strings',
  'tools.json_fmt': 'JSON Formatter & Validator',
  'tools.json_desc': 'Format, validate, and minify JSON strings',
  'tools.yaml_val': 'YAML Validator & Formatter',
  'tools.yaml_desc': 'Validate, format, and convert YAML files',
  'tools.docker_conv': 'Docker Run to Compose Converter',
  'tools.docker_desc': 'Convert docker run commands to Docker Compose YAML',
  'tools.ascii_conv': 'ASCII Converter',
  'tools.ascii_desc': 'Convert ASCII Text to other structure data',

  // Footer
  'footer.nav': 'Navigation',
  'footer.legal': 'Legal',
  'footer.connect': 'Connect',
  'footer.privacy': 'Privacy Policy',
  'footer.terms': 'Terms of Service',
  'footer.rights': 'All rights reserved.',
  'footer.crafted': 'Crafted with ❤️ on',

  // Post navigation
  'post.prev': 'Previous Post',
  'post.next': 'Next Post',
  'post.prev_sub': 'Previous Subpost',
  'post.next_sub': 'Next Subpost',
  'post.parent': 'Parent Post',
  'post.no_older_sub': 'No older subpost',
  'post.no_newer_sub': 'No newer subpost',
  'post.oldest': "You're at the oldest post!",
  'post.newest': "You're at the newest post!",
  'post.no_parent': 'No parent post',

  // Search dialog
  'search.placeholder': 'Search posts...',
  'search.recent_posts': 'Recent Posts',
  'search.recent_searches': 'Recent Searches',
  'search.no_results_prefix': 'No results found for',
  'search.start_typing': 'Start typing to search posts...',
  'search.search_hint': 'Search by title, description, tags, or content',
  'search.loading': 'Searching...',
  'search.loading_index': 'Loading search index...',
  'search.load_more': 'Load more',
  'search.navigate': 'navigate',
  'search.select': 'select',
  'search.close': 'close',
  'search.error': 'Failed to load search index. Please try again later.',
  'search.try_keywords': 'Try different keywords or check your spelling',
  'search.no_results_aria': 'No results found',
  'search.description':
    'Search blog posts by title, description, tags, or content',
  'search.close_label': 'Close search',
  'search.results_label': 'Search results',

  // Reading time
  'reading.min_read': 'min read',

  // Tools breadcrumb labels (reuse tool names for breadcrumbs)
  'tools.breadcrumb': 'Tools',

  // Gallery page
  'gallery.breadcrumb': 'Gallery',
  'gallery.heading': 'AI & Photo Gallery',
  'gallery.desc':
    'Explore curated collections of AI generations and photography.',
  'gallery.photos_count': 'photos',
} as const

export type TranslationKeys = keyof typeof en
