export const STORAGE_KEY = 'sklassics-page-builder-v1'

export const fallbackImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='%23091417'/%3E%3Cstop offset='.55' stop-color='%231a7779'/%3E%3Cstop offset='1' stop-color='%23f0bd45'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='800' fill='url(%23g)'/%3E%3Cpath d='M120 610 350 360l160 126 120-150 450 310H120Z' fill='%23ffffff' opacity='.72'/%3E%3Ccircle cx='875' cy='225' r='108' fill='%23ffffff' opacity='.32'/%3E%3C/svg%3E"

export const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`

const styles = (type) => ({
  background: type === 'hero3d' || type === 'cover' ? '#071315' : '#ffffff',
  headingColor: type === 'hero3d' || type === 'cover' ? '#f7fbfb' : '#162225',
  textColor: type === 'hero3d' || type === 'cover' ? '#b9c9c9' : '#526367',
  accent: '#17a0a3',
  buttonBg: '#17a0a3',
  buttonColor: '#ffffff',
  paddingY: type === 'navbar' ? 18 : type === 'cover' ? 110 : 78,
  paddingX: 56,
  contentWidth: 1180,
  radius: 8,
  gap: 24,
  align: type === 'heroCenter' || type === 'cover' ? 'center' : 'left'
})

export function createSection(type) {
  const base = { id: uid('section'), type, styles: styles(type) }

  if (type === 'navbar') {
    return {
      ...base,
      logo: 'Sklassics',
      tagline: 'Digital company studio',
      links: ['Services', 'Portfolio', 'Pricing', 'Contact'],
      buttons: [{ id: uid('button'), label: 'Start Project', url: 'https://sklassics.example/contact', variant: 'primary' }]
    }
  }

  if (type === 'hero3d') {
    return {
      ...base,
      eyebrow: 'Sklassics company website',
      headline: 'Build a premium 3D website without writing code',
      body: 'A WordPress-like visual builder for company pages, service websites, landing pages, and campaign sections.',
      buttons: [
        { id: uid('button'), label: 'Get Started', url: 'https://sklassics.example/start', variant: 'primary' },
        { id: uid('button'), label: 'View Work', url: 'https://sklassics.example/work', variant: 'secondary' }
      ]
    }
  }

  if (type === 'cover') {
    return {
      ...base,
      eyebrow: 'Company cover page',
      headline: 'Sklassics builds modern websites for ambitious companies',
      body: 'Create a polished cover page, then build the full company website underneath with editable sections, cards, CTAs, images, and backend-ready design data.',
      coverNote: 'Visual builder • 3D website • Backend JSON',
      image: fallbackImage,
      buttons: [
        { id: uid('button'), label: 'Create Website', url: 'https://sklassics.example/start', variant: 'primary' },
        { id: uid('button'), label: 'See Portfolio', url: 'https://sklassics.example/portfolio', variant: 'secondary' }
      ]
    }
  }

  if (type === 'heroSplit') {
    return {
      ...base,
      eyebrow: 'Fast page creation',
      headline: 'Design, preview, and save company pages in one tool',
      body: 'Edit headlines, buttons, images, cards, spacing, colors, and layout directly on the canvas.',
      image: fallbackImage,
      buttons: [
        { id: uid('button'), label: 'Book a Demo', url: 'https://sklassics.example/demo', variant: 'primary' },
        { id: uid('button'), label: 'Learn More', url: 'https://sklassics.example/about', variant: 'secondary' }
      ]
    }
  }

  if (type === 'heroCenter') {
    return {
      ...base,
      eyebrow: 'Conversion section',
      headline: 'Launch pages that feel ready for real clients',
      body: 'Use reusable hero components and CTA buttons with real URL links.',
      buttons: [{ id: uid('button'), label: 'Contact Sales', url: 'https://sklassics.example/sales', variant: 'primary' }]
    }
  }

  if (type === 'cards') {
    return {
      ...base,
      eyebrow: 'Services',
      headline: 'Card blocks with image upload support',
      body: 'Use cards for services, portfolios, testimonials, plans, or product features.',
      cards: [
        { id: uid('card'), title: 'Brand Websites', text: 'High-trust pages for service companies and founders.', image: fallbackImage },
        { id: uid('card'), title: 'Landing Pages', text: 'CTA-led sections built for campaigns and lead capture.', image: fallbackImage },
        { id: uid('card'), title: 'Custom Blocks', text: 'Flexible layouts for unique company storytelling.', image: fallbackImage }
      ]
    }
  }

  return {
    ...base,
    stat: '3.8x',
    statLabel: 'Faster page production',
    headline: 'Custom design sections for any company workflow',
    body: 'Duplicate, reorder, delete, restyle, and save every section as structured page data.',
    buttons: [{ id: uid('button'), label: 'Customize Section', url: 'https://sklassics.example/custom', variant: 'primary' }]
  }
}

export function defaultPage() {
  return {
    title: 'Sklassics Company Website',
    sections: [createSection('navbar'), createSection('cover'), createSection('hero3d'), createSection('cards'), createSection('custom')]
  }
}

export function cloneSection(section) {
  const copy = structuredClone(section)
  copy.id = uid('section')
  copy.buttons?.forEach((button) => {
    button.id = uid('button')
  })
  copy.cards?.forEach((card) => {
    card.id = uid('card')
  })
  return copy
}
