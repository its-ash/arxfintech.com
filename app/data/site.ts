import type { Component } from 'vue'
import {
  PhArrowsLeftRight,
  PhAt,
  PhBank,
  PhBrowser,
  PhCertificate,
  PhChartBar,
  PhChartLineUp,
  PhChatCircleText,
  PhClockCountdown,
  PhCloud,
  PhCopy,
  PhDesktop,
  PhDevices,
  PhEnvelope,
  PhEnvelopeSimple,
  PhFileText,
  PhFlowArrow,
  PhGauge,
  PhGlobe,
  PhGlobeHemisphereWest,
  PhHandCoins,
  PhHardDrives,
  PhLightning,
  PhLockKey,
  PhMagnifyingGlass,
  PhPaintBrush,
  PhPercent,
  PhPhoneCall,
  PhPlugsConnected,
  PhRanking,
  PhRocketLaunch,
  PhScales,
  PhSealCheck,
  PhShieldCheck,
  PhSliders,
  PhSpeedometer,
  PhStack,
  PhStrategy,
  PhTranslate,
  PhTreeStructure,
  PhUsersFour,
  PhUsersThree,
  PhWarningCircle,
  PhWaveform,
} from '@phosphor-icons/vue'
import type { SceneState } from '~/lib/scene'

export type GroupId = 'company' | 'digital' | 'trading' | 'consulting'

export interface Feature {
  icon: Component
  title: string
  text: string
}

export interface Step {
  title: string
  text: string
}

export interface Faq {
  q: string
  a: string
}

export interface Service {
  slug: string
  group: GroupId
  label: string
  blurb: string
  icon: Component
  headline: string
  lede: string
  scene: SceneState
  bullets: string[]
  features: Feature[]
  steps: Step[]
  faq: Faq[]
}

export interface Group {
  id: GroupId
  label: string
  short: string
  stage: string
  text: string
}

export const site = {
  name: 'ARX Fintech',
  url: 'https://arxfintech.com',
  title: 'ARX Fintech | Brokerage setup and trading technology',
  description:
    'ARX Fintech sets up offshore and regulated brokerages and delivers the trading platform, liquidity bridge, copy trading, MAM, website, email and phone numbers they need.',
}

export const company = {
  legalName: 'A R X FINTECH MARKETING MANAGEMENT L.L.C',
  type: 'Limited liability company',
  license: '1650312',
  authority: 'Dubai Economy and Tourism (DET), Government of Dubai, UAE',
  activities: ['Marketing management', 'Cost control and risk management services'],
  email: 'connect@arxfintech.com',
  phone: '+971 50 935 5387',
  phoneHref: 'tel:+971509355387',
  web: 'www.arxfintech.com',
  address: {
    street: 'Office 504, The Atrium Center, Bank Street',
    area: 'Mankhool, Bur Dubai',
    city: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
  },
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=The%20Atrium%20Center%2C%20Bank%20Street%2C%20Mankhool%2C%20Bur%20Dubai',
}

export const companyNote = `${company.legalName} is a limited liability company incorporated under ${company.authority}, with Trade License Number ${company.license}.`

export const groups: Group[] = [
  {
    id: 'company',
    label: 'Company setup',
    short: 'Company setup',
    stage: 'Set up your company',
    text: 'Choose an offshore or regulated path. We handle incorporation, licensing, banking and compliance.',
  },
  {
    id: 'digital',
    label: 'Digital presence',
    short: 'Digital',
    stage: 'Build your brand online',
    text: 'Domain, hosting, website, business email and local phone numbers, ready before your first client.',
  },
  {
    id: 'trading',
    label: 'Trading technology',
    short: 'Trading',
    stage: 'Go live with trading technology',
    text: 'A trading platform on every device, a liquidity bridge, copy trading and MAM accounts.',
  },
  {
    id: 'consulting',
    label: 'Consultancy',
    short: 'Consultancy',
    stage: 'Run a profitable desk',
    text: 'Dealing and risk consultancy that protects your margins as your client base grows.',
  },
]

const globe = (x: number, z = 7, tilt = 0.35, y = 0): SceneState => ({ morph: 0, x, y, z, tilt })
const chart = (x: number, z = 7.5, y = -0.3): SceneState => ({ morph: 1, x, y, z, tilt: 0 })
const ring = (x: number, z = 7.5, tilt = 1.05, y = 0): SceneState => ({ morph: 2, x, y, z, tilt })
const wave = (x: number, z = 7, tilt = 0.5, y = -0.5): SceneState => ({ morph: 3, x, y, z, tilt })

export const services: Service[] = [
  {
    slug: 'offshore-brokerage-setup',
    group: 'company',
    label: 'Offshore brokerage setup',
    blurb: 'Incorporate and license a brokerage in an offshore jurisdiction.',
    icon: PhGlobeHemisphereWest,
    headline: 'Set up an offshore brokerage, *ready to trade*',
    lede: 'We handle incorporation, the licence application, bank and payment accounts, and the technology. You focus on clients.',
    scene: globe(1.7),
    bullets: [
      'Jurisdiction review against your budget and target markets',
      'Company incorporation and registered office',
      'Licence application and document preparation',
      'Introductions to corporate banks and payment providers',
      'AML and KYC policy templates',
      'Trading platform and website ready on launch day',
    ],
    features: [
      { icon: PhScales, title: 'Jurisdiction fit', text: 'We compare cost, timeline, capital needs and market access, then recommend the jurisdiction that fits your plan.' },
      { icon: PhFileText, title: 'Full document pack', text: 'Business plan, policies, compliance manuals and application forms, prepared and checked before submission.' },
      { icon: PhBank, title: 'Banking and payments', text: 'Introductions to corporate banks, payment service providers and crypto gateways that work with offshore brokers.' },
      { icon: PhRocketLaunch, title: 'Technology included', text: 'Platform, bridge, website and email are built in parallel, so you can launch when the licence arrives.' },
    ],
    steps: [
      { title: 'Consultation', text: 'We learn your business model, budget and target markets.' },
      { title: 'Structure', text: 'We select the jurisdiction and the company structure.' },
      { title: 'Application', text: 'We prepare and file the incorporation and licence documents.' },
      { title: 'Launch', text: 'Accounts, platform and website go live together.' },
    ],
    faq: [
      { q: 'How long does an offshore setup take?', a: 'The timeline depends on the jurisdiction and on how fast your documents are ready. After the first consultation, we give you a plan with dates.' },
      { q: 'Do I need to travel?', a: 'Usually not. We manage the process remotely and tell you early if a jurisdiction needs an in-person step.' },
      { q: 'Can I add a regulated licence later?', a: 'Yes. Many clients start offshore and add a regulated entity as they grow. We plan the structure so that this step is simple.' },
    ],
  },
  {
    slug: 'regulated-brokerage-setup',
    group: 'company',
    label: 'Regulated brokerage setup',
    blurb: 'Apply for a full licence with a recognised financial regulator.',
    icon: PhCertificate,
    headline: 'Build a regulated brokerage on *solid ground*',
    lede: 'From the business plan to the last regulator question, we guide your application and build the operations a regulator expects.',
    scene: ring(1.8),
    bullets: [
      'Regulator and jurisdiction selection',
      'Business plan and financial projections',
      'Compliance, AML and risk policies',
      'Guidance on key people and governance',
      'Capital adequacy planning',
      'Back office and reports ready for audit',
    ],
    features: [
      { icon: PhSealCheck, title: 'Application management', text: 'We prepare the full submission and manage the questions from the regulator until approval.' },
      { icon: PhShieldCheck, title: 'Compliance framework', text: 'AML, KYC, client classification, best execution and complaints policies, written for your business.' },
      { icon: PhUsersThree, title: 'Governance and people', text: 'Guidance on directors, compliance officers and the local substance that a regulator requires.' },
      { icon: PhChartBar, title: 'Reporting ready', text: 'Back office and reports that support transaction reporting, client money rules and audits.' },
    ],
    steps: [
      { title: 'Assessment', text: 'We check your plan against the requirements of the regulator.' },
      { title: 'Preparation', text: 'We write the business plan, the policies and the application.' },
      { title: 'Submission', text: 'We file the application and answer every regulator question.' },
      { title: 'Operation', text: 'We set up the systems and reports for ongoing compliance.' },
    ],
    faq: [
      { q: 'Which regulators do you work with?', a: 'We support applications in several onshore and mid-shore jurisdictions. Tell us your target markets and we recommend the best options.' },
      { q: 'How much capital do I need?', a: 'Minimum capital depends on the regulator and the licence type. We give you the exact figures for each option before you decide.' },
      { q: 'Do you provide compliance officers?', a: 'We help you find and onboard qualified people. Our consultants also support your team after approval.' },
    ],
  },
  {
    slug: 'website-creation',
    group: 'digital',
    label: 'Website creation',
    blurb: 'A fast, compliant broker website that turns visitors into clients.',
    icon: PhBrowser,
    headline: 'A broker website built to *convert*',
    lede: 'We design and build a fast website with your brand, legal pages, account opening links and support for many languages.',
    scene: globe(1.8, 7.5, 0.4),
    bullets: [
      'Custom design for your brand',
      'Pages for account types, platforms and instruments',
      'Legal, risk and compliance pages',
      'Links to sign-up and the client area',
      'Content in many languages',
      'Search engine basics and analytics',
    ],
    features: [
      { icon: PhPaintBrush, title: 'Designed for your brand', text: 'A unique design, not a template, that matches your trading platform and apps.' },
      { icon: PhSpeedometer, title: 'Fast on every device', text: 'Pages load quickly on mobile networks and pass Core Web Vitals.' },
      { icon: PhTranslate, title: 'Many languages', text: 'Reach clients in their own language, with clear language switching on every page.' },
      { icon: PhMagnifyingGlass, title: 'Ready for search', text: 'Clean structure, meta data and site maps help new clients find you.' },
    ],
    steps: [
      { title: 'Brief', text: 'We agree on pages, languages and visual style.' },
      { title: 'Design', text: 'We show you the designs for approval.' },
      { title: 'Build', text: 'We build, test and connect the sign-up flows.' },
      { title: 'Launch', text: 'We publish the site on your domain and hosting.' },
    ],
    faq: [
      { q: 'Can my team edit the website?', a: 'Yes. We can add a simple content editor so your team can update text, news and promotions.' },
      { q: 'Do you write the legal pages?', a: 'We supply templates for the usual legal and risk pages. Your compliance team or ours reviews them for your licence.' },
      { q: 'How long does a website take?', a: 'A standard broker website takes a few weeks from the approved brief to launch. We give you dates at the start.' },
    ],
  },
  {
    slug: 'domain-and-hosting',
    group: 'digital',
    label: 'Domain and hosting',
    blurb: 'Domain registration and secure, managed web hosting.',
    icon: PhHardDrives,
    headline: 'Domains and hosting that *stay online*',
    lede: 'We register your domains, set up DNS and host your website on secure, managed servers with backups and monitoring.',
    scene: globe(1.6, 6.8, 0.3),
    bullets: [
      'Domain search and registration',
      'DNS setup and management',
      'SSL certificates on every domain',
      'Managed hosting with daily backups',
      'DDoS protection and firewall',
      'Uptime monitoring and alerts',
    ],
    features: [
      { icon: PhGlobe, title: 'Domain registration', text: 'We find and register the right domains, including regional names and brand protection.' },
      { icon: PhCloud, title: 'Managed hosting', text: 'Servers sized for your traffic. We apply updates and security patches for you.' },
      { icon: PhLockKey, title: 'Secure by default', text: 'SSL, firewall rules and DDoS protection on every site we host.' },
      { icon: PhClockCountdown, title: 'Backups and recovery', text: 'Daily backups and a tested recovery plan if something goes wrong.' },
    ],
    steps: [
      { title: 'Choose', text: 'We help you select and register your domains.' },
      { title: 'Configure', text: 'We set the DNS, SSL and email records.' },
      { title: 'Host', text: 'We deploy your website to managed servers.' },
      { title: 'Monitor', text: 'We watch uptime and keep the servers updated.' },
    ],
    faq: [
      { q: 'Can you move my current domain?', a: 'Yes. We transfer domains and websites without downtime and keep your email running.' },
      { q: 'Who owns the domain?', a: 'You do. We register every domain in your company name.' },
      { q: 'Is hosting included with the website?', a: 'You can add hosting to your website package or buy it as a separate service.' },
    ],
  },
  {
    slug: 'business-email',
    group: 'digital',
    label: 'Business email',
    blurb: 'Email accounts on your domain, created and hosted for your team.',
    icon: PhEnvelopeSimple,
    headline: 'Business email on your *own domain*',
    lede: 'We create mailboxes for your team, host them securely and set the records that keep your messages out of spam folders.',
    scene: ring(1.8, 7.5, 0.9),
    bullets: [
      'A mailbox for each team member',
      'Shared inboxes for support, sales and compliance',
      'SPF, DKIM and DMARC setup',
      'Spam and malware filtering',
      'Access on web, desktop and mobile',
      'Transactional email for your platform and CRM',
    ],
    features: [
      { icon: PhAt, title: 'Your domain', text: 'Every address uses your brand, for example support@yourbroker.com.' },
      { icon: PhSealCheck, title: 'Inbox delivery', text: 'Correct SPF, DKIM and DMARC records, so your emails reach your clients.' },
      { icon: PhShieldCheck, title: 'Protected accounts', text: 'Spam filtering, malware scanning and two-factor sign-in on every mailbox.' },
      { icon: PhEnvelope, title: 'Platform email', text: 'Account, deposit and margin call emails sent reliably from your systems.' },
    ],
    steps: [
      { title: 'Plan', text: 'We list the mailboxes and aliases that you need.' },
      { title: 'Create', text: 'We create the accounts and shared inboxes.' },
      { title: 'Secure', text: 'We set DNS records, filtering and sign-in rules.' },
      { title: 'Support', text: 'We add users and fix issues when you ask.' },
    ],
    faq: [
      { q: 'Which email provider do you use?', a: 'We work with leading business email providers and recommend one for your team size and budget.' },
      { q: 'Can you move our current email?', a: 'Yes. We migrate your mailboxes with their messages, contacts and calendars.' },
      { q: 'Why do our emails go to spam?', a: 'Usually because DNS records are missing or wrong. We set SPF, DKIM and DMARC correctly to fix this.' },
    ],
  },
  {
    slug: 'virtual-numbers',
    group: 'digital',
    label: 'Virtual numbers',
    blurb: 'Local phone numbers in your target countries for sales and support.',
    icon: PhPhoneCall,
    headline: 'Local phone numbers in *every* target market',
    lede: 'Get virtual numbers in the countries where your clients live. Route calls to your team anywhere, with recording and reports.',
    scene: globe(1.7, 6.5, 0.2),
    bullets: [
      'Local, national and toll-free numbers',
      'Call routing to any team or location',
      'Call recording for compliance',
      'Numbers ready for SMS and messaging',
      'Integration with your CRM',
      'Call reports and analytics',
    ],
    features: [
      { icon: PhGlobeHemisphereWest, title: 'Local presence', text: 'Clients call a local number. Your team answers from anywhere.' },
      { icon: PhFlowArrow, title: 'Smart routing', text: 'Route calls by language, time zone or client status.' },
      { icon: PhWaveform, title: 'Call recording', text: 'Record and store calls to meet compliance requirements.' },
      { icon: PhChatCircleText, title: 'SMS and messaging', text: 'Send verification codes and messages from the same numbers.' },
    ],
    steps: [
      { title: 'Select', text: 'We choose countries and number types with you.' },
      { title: 'Register', text: 'We complete the local registration requirements.' },
      { title: 'Route', text: 'We set routing, business hours and recording.' },
      { title: 'Connect', text: 'We link the numbers to your CRM and your team.' },
    ],
    faq: [
      { q: 'Which countries are available?', a: 'Numbers are available in many countries. Some countries need local documents, and we tell you what is necessary.' },
      { q: 'Can calls go to mobile phones?', a: 'Yes. Calls can go to desk phones, mobile apps or a call center system.' },
      { q: 'Are calls recorded?', a: 'Recording is available on every number. You set the retention period.' },
    ],
  },
  {
    slug: 'trading-platform',
    group: 'trading',
    label: 'Trading platform',
    blurb: 'Web, desktop and mobile trading under your own brand.',
    icon: PhDevices,
    headline: 'A trading platform your clients *enjoy*',
    lede: 'Give traders fast execution, advanced charts and a clean experience on web, desktop and mobile. Your brand, your domain.',
    scene: chart(0.6),
    bullets: [
      'Web terminal that runs in any browser',
      'Desktop apps for Windows and macOS',
      'iOS and Android apps under your brand',
      'Forex, metals, indices, stocks and crypto CFDs',
      'Advanced charts, indicators and one-click trading',
      'Admin panel for groups, spreads and leverage',
    ],
    features: [
      { icon: PhDesktop, title: 'Every screen covered', text: 'One account on web, desktop and mobile, with positions and settings in sync.' },
      { icon: PhChartLineUp, title: 'Professional charts', text: 'Many timeframes, drawing tools, indicators and trading from the chart.' },
      { icon: PhPaintBrush, title: 'Fully white label', text: 'Your logo, colours, domain and app store listing. Clients see only your brand.' },
      { icon: PhSliders, title: 'Dealer controls', text: 'Set spreads, swaps, leverage and margin by group, symbol or client.' },
    ],
    steps: [
      { title: 'Brand', text: 'Send us your logo, colours and domain.' },
      { title: 'Configure', text: 'We set up symbols, groups and trading conditions.' },
      { title: 'Connect', text: 'We link liquidity, CRM and payment systems.' },
      { title: 'Go live', text: 'We publish the apps and open the platform to clients.' },
    ],
    faq: [
      { q: 'How fast can the platform go live?', a: 'A branded web and desktop platform can be live in days. App store publication depends on Apple and Google review times.' },
      { q: 'Which assets can my clients trade?', a: 'Forex, metals, energies, indices, stocks and crypto CFDs. You choose the symbols for each client group.' },
      { q: 'Can I connect my own liquidity provider?', a: 'Yes. Our liquidity bridge connects the platform to one or many providers.' },
    ],
  },
  {
    slug: 'liquidity-bridge',
    group: 'trading',
    label: 'Liquidity bridge',
    blurb: 'Route orders to many liquidity providers with full control.',
    icon: PhPlugsConnected,
    headline: 'Connect to *deep liquidity* with one bridge',
    lede: 'Aggregate prices from many providers, route each order by your own rules and manage A-book and B-book flow from one dashboard.',
    scene: wave(1.4),
    bullets: [
      'FIX API connection to major liquidity providers',
      'Price aggregation and best-price routing',
      'A-book, B-book and hybrid execution rules',
      'Markups and spread control by group',
      'Live exposure and fill monitoring',
      'Automatic failover between providers',
    ],
    features: [
      { icon: PhArrowsLeftRight, title: 'Smart order routing', text: 'Route each order by symbol, size, client group or risk score.' },
      { icon: PhLightning, title: 'Low latency', text: 'Hosted near major liquidity venues for fast and stable fills.' },
      { icon: PhStack, title: 'Price aggregation', text: 'Combine many feeds into one clean book with the best bid and ask.' },
      { icon: PhGauge, title: 'Live monitoring', text: 'See exposure, slippage and rejections in real time, and act fast.' },
    ],
    steps: [
      { title: 'Map', text: 'We review your platform, providers and order flow.' },
      { title: 'Connect', text: 'We set up FIX sessions and symbol mapping.' },
      { title: 'Rules', text: 'We configure routing, markups and risk limits.' },
      { title: 'Monitor', text: 'We test fills and monitor the bridge after launch.' },
    ],
    faq: [
      { q: 'Which platforms does the bridge support?', a: 'The bridge works with our trading platform and with other common retail platforms through standard gateways.' },
      { q: 'Can I use more than one liquidity provider?', a: 'Yes. You can aggregate many providers and route by symbol or by rule.' },
      { q: 'Who manages the bridge after launch?', a: 'Our team monitors it with you and changes rules when you ask. You keep full control in the dashboard.' },
    ],
  },
  {
    slug: 'copy-trading',
    group: 'trading',
    label: 'Copy trading',
    blurb: 'Let clients follow strategy providers with one click.',
    icon: PhCopy,
    headline: 'Copy trading that *grows* deposits',
    lede: 'Clients follow experienced traders automatically. Strategy providers earn fees, followers start easily and your volume grows.',
    scene: chart(0.5, 8),
    bullets: [
      'Strategy provider profiles with full statistics',
      'Proportional, fixed and multiplier copy modes',
      'Performance, subscription and volume fees',
      'Risk limits and stop-copy rules for followers',
      'Leaderboards with ranking filters',
      'Available on web and mobile',
    ],
    features: [
      { icon: PhRanking, title: 'Public leaderboard', text: 'Followers compare strategies by return, drawdown, age and risk score.' },
      { icon: PhSliders, title: 'Flexible copy modes', text: 'Copy by equity ratio, fixed lot or multiplier, with limits for each follower.' },
      { icon: PhHandCoins, title: 'Fee engine', text: 'Performance and subscription fees calculated and paid on your schedule.' },
      { icon: PhShieldCheck, title: 'Follower protection', text: 'Equity stop-loss, maximum lot rules and instant stop-copy.' },
    ],
    steps: [
      { title: 'Plan', text: 'We agree on fee models and provider rules.' },
      { title: 'Configure', text: 'We set copy modes, limits and payout cycles.' },
      { title: 'Brand', text: 'We match the copy portal to your brand.' },
      { title: 'Launch', text: 'We onboard your first strategy providers.' },
    ],
    faq: [
      { q: 'Who can become a strategy provider?', a: 'You decide. Approve providers manually, or set rules such as a minimum history and deposit.' },
      { q: 'How are fees paid?', a: 'The system calculates fees automatically and pays providers on the cycle you choose.' },
      { q: 'Is copy trading available on mobile?', a: 'Yes. Followers can find, follow and stop strategies in the mobile app.' },
    ],
  },
  {
    slug: 'mam',
    group: 'trading',
    label: 'MAM accounts',
    blurb: 'Multi-account management for money managers and their investors.',
    icon: PhUsersFour,
    headline: 'MAM accounts for *professional* money managers',
    lede: 'Managers trade one master account and allocate to many investor accounts, with fair allocation, clear reports and automatic fees.',
    scene: ring(1.7, 7.5, 1.1),
    bullets: [
      'One master account for many investor accounts',
      'Lot, percentage, equity and balance allocation',
      'Performance and management fees',
      'Investor reports and statements',
      'Portals for managers and investors',
      'Works with your trading platform and CRM',
    ],
    features: [
      { icon: PhTreeStructure, title: 'Fair allocation', text: 'Allocate trades by lot, percentage, equity or balance, without rounding gaps.' },
      { icon: PhPercent, title: 'Automatic fees', text: 'Performance, management and high-water mark fees, calculated without spreadsheets.' },
      { icon: PhFileText, title: 'Clear reports', text: 'Investors see their own results. Managers see the full picture.' },
      { icon: PhLockKey, title: 'Controlled access', text: 'Investors approve the manager and can stop at any time under your terms.' },
    ],
    steps: [
      { title: 'Enable', text: 'We turn on MAM for your trading platform.' },
      { title: 'Rules', text: 'We set allocation methods and fee terms.' },
      { title: 'Onboard', text: 'Managers invite investors through their portal.' },
      { title: 'Operate', text: 'Trades, fees and reports run automatically.' },
    ],
    faq: [
      { q: 'How is MAM different from copy trading?', a: 'In MAM, a manager trades for investors from one master account. In copy trading, followers choose public strategies and copy them to their own accounts.' },
      { q: 'Can investors see the trades?', a: 'Yes. You decide how much detail investors see in their reports.' },
      { q: 'Which allocation methods are available?', a: 'Lot, percentage, equity and balance. Each manager can use a different method.' },
    ],
  },
  {
    slug: 'dealing-risk-consultancy',
    group: 'consulting',
    label: 'Dealing and risk consultancy',
    blurb: 'Expert guidance on dealing desk setup, risk and execution.',
    icon: PhStrategy,
    headline: 'Run your dealing desk with *confidence*',
    lede: 'Our dealing and risk specialists help you set execution models, exposure limits and daily routines that protect your margins.',
    scene: ring(1.8, 7.2, 1),
    bullets: [
      'A-book, B-book and hybrid model design',
      'Exposure limits and hedging rules',
      'Toxic flow and arbitrage detection',
      'Symbol, spread and swap configuration',
      'Dealer training and daily procedures',
      'Risk reports for management',
    ],
    features: [
      { icon: PhStrategy, title: 'Execution model', text: 'We design the A-book, B-book or hybrid model that suits your clients and capital.' },
      { icon: PhWarningCircle, title: 'Toxic flow control', text: 'Find latency arbitrage, scalping abuse and bonus abuse early.' },
      { icon: PhChartBar, title: 'Risk reporting', text: 'Daily exposure, P&L and client profitability reports that you can act on.' },
      { icon: PhUsersThree, title: 'Desk training', text: 'We train your dealers on routines, escalation and platform tools.' },
    ],
    steps: [
      { title: 'Review', text: 'We audit your current setup and order flow.' },
      { title: 'Design', text: 'We define models, limits and procedures.' },
      { title: 'Implement', text: 'We configure the bridge and platform rules.' },
      { title: 'Coach', text: 'We support your dealers until the desk runs smoothly.' },
    ],
    faq: [
      { q: 'Do you run the dealing desk for us?', a: 'We can support your desk during the launch period and train your team to take over.' },
      { q: 'Can you review an existing brokerage?', a: 'Yes. We audit your current settings, find risk leaks and give you a clear action plan.' },
      { q: 'Can I book consultancy on its own?', a: 'Yes. Consultancy is available without our other services.' },
    ],
  },
]

export const bySlug = Object.fromEntries(services.map((s) => [s.slug, s])) as Record<string, Service>

export const inGroup = (id: GroupId) => services.filter((s) => s.group === id)

export const facts = [
  { value: '13', label: 'Services, from company setup to the dealing desk' },
  { value: '2', label: 'Licence paths: offshore and regulated' },
  { value: '3', label: 'Trading platforms: web, desktop and mobile' },
  { value: '1', label: 'Partner and one contract for the full stack' },
]

export const kinetic = [
  ['Offshore setup', 'Regulated setup', 'Trading platform', 'Liquidity bridge', 'Copy trading'],
  ['MAM accounts', 'Websites', 'Domains', 'Hosting', 'Business email', 'Virtual numbers', 'Risk consultancy'],
]

export const reasons = [
  'Full brokerage infrastructure, from company to dealing desk',
  'Deep knowledge of FX and fintech',
  'Enterprise-grade security and encryption',
  'Scales from start-ups to high-volume brokers',
  'Dedicated technical support',
  'Cost-effective packages',
  'Transparent, long-term partnership',
]

export const compare = [
  {
    slug: 'offshore-brokerage-setup',
    title: 'Offshore',
    text: 'Faster to launch, with lower capital and running costs. A good start for brokers that target international clients.',
    points: ['Shorter timeline', 'Lower minimum capital', 'Flexible trading conditions'],
  },
  {
    slug: 'regulated-brokerage-setup',
    title: 'Regulated',
    text: 'A recognised licence that builds trust with clients, banks and partners in strict markets.',
    points: ['Access to regulated markets', 'Strong bank and partner trust', 'Clear investor protection'],
  },
]

export const homeSteps: Step[] = [
  { title: 'Discovery call', text: 'Tell us your model, markets and budget.' },
  { title: 'Plan and quote', text: 'You get one plan, with dates and a clear price.' },
  { title: 'Build in parallel', text: 'Company, brand and technology move at the same time.' },
  { title: 'Launch and support', text: 'We go live together and stay with you after launch.' },
]

export const homeFaq: Faq[] = [
  { q: 'Can I buy one service on its own?', a: 'Yes. Every service is available alone or as part of a full package.' },
  { q: 'Do you work with new and existing brokers?', a: 'Yes. We set up new brokerages and help existing firms add or replace technology.' },
  { q: 'Should I start offshore or regulated?', a: 'It depends on your target markets, budget and timeline. We compare both paths with you in the first call.' },
  { q: 'What happens after launch?', a: 'Our team stays with you for support, updates and consultancy as your brokerage grows.' },
]

export const values = [
  { title: 'One partner', text: 'Company, brand, technology and dealing advice come from one team that sees the full picture.' },
  { title: 'Plain answers', text: 'Clear plans, clear prices and honest timelines. No surprises after you sign.' },
  { title: 'Built to scale', text: 'The setup that launches your brokerage also supports it at high volume.' },
  { title: 'Long-term support', text: 'We measure success by your growth, not by the first invoice.' },
]
