import type { LucideIcon } from 'lucide-react'
import type { ProductLocale } from '@/app/i18n/settings'
import { getProductText, getToolText, type MessageKey } from '@/lib/product-i18n'
import {
  AlarmClock,
  ArrowLeftRight,
  CalendarDays,
  Calculator,
  CaseSensitive,
  Clock3,
  Dices,
  FileDiff,
  Gamepad2,
  Lightbulb,
  ListChecks,
  Percent,
  Pickaxe,
  Puzzle,
  Radio,
  Scale,
  Timer,
  UsersRound,
  WholeWord,
} from 'lucide-react'

export type ToolCategory = 'meetings' | 'tools' | 'break' | 'discover'
export type ToolStatus = 'available' | 'planned'

export type ToolDefinition = {
  id: string
  name: string
  slug: string
  category: ToolCategory
  description: string
  keywords: string[]
  estimatedUsageTime: string
  icon: LucideIcon
  seoTitle: string
  seoDescription: string
  status: ToolStatus
}

export const categoryDetails: Record<ToolCategory, { name: string; description: string }> = {
  meetings: {
    name: 'Meetings',
    description: 'Plan across time zones and make everyday meeting logistics easier.',
  },
  tools: {
    name: 'Tools',
    description: 'Small, useful tools for common workday tasks.',
  },
  break: {
    name: 'Break',
    description: 'Take a short reset with a timer or a quick game.',
  },
  discover: {
    name: 'Discover',
    description: 'A little curiosity and light-hearted content for your workday.',
  },
}

export const tools: ToolDefinition[] = [
  {
    id: 'world-clock', name: 'World Clock', slug: 'world-clock', category: 'meetings',
    description: 'See the current local time and date across the cities your team works in.',
    keywords: ['time', 'city', 'timezone', 'world'], estimatedUsageTime: '1 min', icon: Clock3,
    seoTitle: 'World Clock for Global Teams', seoDescription: 'Compare local times in cities around the world with daylight-saving-aware IANA time zones.', status: 'available',
  },
  {
    id: 'time-zone-converter', name: 'Time Zone Converter', slug: 'time-zone-converter', category: 'meetings',
    description: 'Convert a date and time between time zones, including the day change.',
    keywords: ['convert', 'time', 'timezone', 'date'], estimatedUsageTime: '1 min', icon: ArrowLeftRight,
    seoTitle: 'Time Zone Converter', seoDescription: 'Convert local dates and times between IANA time zones and compare multiple locations.', status: 'available',
  },
  {
    id: 'meeting-planner', name: 'Meeting Time Planner', slug: 'meeting-planner', category: 'meetings',
    description: 'Compare working-hour windows and inspect candidate meeting times.',
    keywords: ['meeting', 'planner', 'timezone', 'work hours'], estimatedUsageTime: '3 min', icon: UsersRound,
    seoTitle: 'Meeting Time Planner for Multiple Time Zones', seoDescription: 'Find candidate meeting times from participant time zones and working-hour ranges.', status: 'available',
  },
  {
    id: 'meeting-countdown', name: 'Meeting Countdown', slug: 'meeting-countdown', category: 'meetings',
    description: 'Keep one or more upcoming meetings visible with local countdowns.',
    keywords: ['meeting', 'countdown', 'calendar'], estimatedUsageTime: '1 min', icon: AlarmClock,
    seoTitle: 'Meeting Countdown', seoDescription: 'Create local meeting countdowns in your browser without an account.', status: 'available',
  },
  {
    id: 'meeting-timer', name: 'Meeting Timer', slug: 'meeting-timer', category: 'meetings',
    description: 'Keep a meeting or agenda segment on time with a simple timer.',
    keywords: ['meeting', 'timer', 'agenda'], estimatedUsageTime: '1 min', icon: Timer,
    seoTitle: 'Meeting Timer', seoDescription: 'Run a meeting timer with duration presets and agenda stages.', status: 'available',
  },
  {
    id: 'working-days-calculator', name: 'Working Days Calculator', slug: 'working-days-calculator', category: 'meetings',
    description: 'Count weekdays between dates with configurable workdays and holidays.',
    keywords: ['working days', 'business days', 'date', 'holiday'], estimatedUsageTime: '2 min', icon: CalendarDays,
    seoTitle: 'Working Days Calculator', seoDescription: 'Calculate working days between dates using your chosen workweek and holidays.', status: 'available',
  },
  {
    id: 'date-time-calculator', name: 'Date & Time Calculator', slug: 'date-time-calculator', category: 'meetings',
    description: 'Add or subtract days and hours from a date and time.',
    keywords: ['date', 'time', 'calculator', 'duration'], estimatedUsageTime: '1 min', icon: Calculator,
    seoTitle: 'Date and Time Calculator', seoDescription: 'Add or subtract days, hours, and minutes from a date and time.', status: 'available',
  },
  {
    id: 'percentage-calculator', name: 'Percentage Calculator', slug: 'percentage-calculator', category: 'tools',
    description: 'Calculate a percentage of a value or compare percentage change.',
    keywords: ['percentage', 'percent', 'change', 'calculator'], estimatedUsageTime: '1 min', icon: Percent,
    seoTitle: 'Percentage Calculator', seoDescription: 'Calculate percentages, percentage changes, increases, and decreases.', status: 'available',
  },
  {
    id: 'growth-rate-calculator', name: 'Growth Rate Calculator', slug: 'growth-rate-calculator', category: 'tools',
    description: 'Calculate growth or decline between values, including multi-period rates.',
    keywords: ['growth', 'rate', 'change', 'calculator'], estimatedUsageTime: '1 min', icon: Scale,
    seoTitle: 'Growth Rate Calculator', seoDescription: 'Calculate growth rate and compound growth across multiple periods.', status: 'available',
  },
  {
    id: 'word-counter', name: 'Word Counter', slug: 'word-counter', category: 'tools',
    description: 'Count characters, words, sentences, and paragraphs as you type.',
    keywords: ['word count', 'character count', 'text', 'writing'], estimatedUsageTime: '1 min', icon: WholeWord,
    seoTitle: 'Word and Character Counter', seoDescription: 'Count words, characters, sentences, and paragraphs locally in your browser.', status: 'available',
  },
  {
    id: 'text-case-converter', name: 'Text Case Converter', slug: 'text-case-converter', category: 'tools',
    description: 'Convert text to uppercase, lowercase, title case, or sentence case.',
    keywords: ['text', 'uppercase', 'lowercase', 'title case'], estimatedUsageTime: '1 min', icon: CaseSensitive,
    seoTitle: 'Text Case Converter', seoDescription: 'Convert text between uppercase, lowercase, title case, and sentence case.', status: 'available',
  },
  {
    id: 'text-compare', name: 'Text Compare', slug: 'text-compare', category: 'tools',
    description: 'Compare two text drafts and review inserted or removed lines.',
    keywords: ['compare', 'diff', 'text', 'draft'], estimatedUsageTime: '2 min', icon: FileDiff,
    seoTitle: 'Text Compare Tool', seoDescription: 'Compare two text blocks and highlight added and removed lines locally.', status: 'available',
  },
  {
    id: 'random-team-generator', name: 'Random Team Generator', slug: 'random-team-generator', category: 'tools',
    description: 'Shuffle a participant list into balanced groups.',
    keywords: ['random', 'team', 'groups', 'shuffle'], estimatedUsageTime: '1 min', icon: UsersRound,
    seoTitle: 'Random Team Generator', seoDescription: 'Split a participant list into randomly shuffled teams in your browser.', status: 'available',
  },
  {
    id: 'random-picker', name: 'Random Picker', slug: 'random-picker', category: 'tools',
    description: 'Pick one or more items at random from a list.',
    keywords: ['random', 'picker', 'choice', 'draw'], estimatedUsageTime: '1 min', icon: Dices,
    seoTitle: 'Random Picker', seoDescription: 'Choose random items from a list with optional repeat selection.', status: 'available',
  },
  {
    id: '2048', name: '2048', slug: '2048', category: 'break',
    description: 'Combine matching tiles and work toward the 2048 tile.',
    keywords: ['game', '2048', 'puzzle', 'break'], estimatedUsageTime: '5 min', icon: Puzzle,
    seoTitle: 'Play 2048', seoDescription: 'Play a quick, free 2048 number puzzle in your browser.', status: 'available',
  },
  {
    id: 'sudoku', name: 'Sudoku', slug: 'sudoku', category: 'break',
    description: 'Fill a number grid using logic, with a fresh puzzle each game.',
    keywords: ['game', 'sudoku', 'logic', 'puzzle'], estimatedUsageTime: '10 min', icon: Puzzle,
    seoTitle: 'Play Sudoku', seoDescription: 'Play a browser-based Sudoku puzzle with notes and mistake checks.', status: 'available',
  },
  {
    id: 'minesweeper', name: 'Minesweeper', slug: 'minesweeper', category: 'break',
    description: 'Use number clues to reveal safe cells and flag hidden mines.',
    keywords: ['game', 'minesweeper', 'logic', 'puzzle'], estimatedUsageTime: '5 min', icon: Pickaxe,
    seoTitle: 'Play Minesweeper', seoDescription: 'Play Minesweeper in your browser with touch-friendly controls.', status: 'available',
  },
  {
    id: '5-minute-break', name: '5-Minute Break Timer', slug: '5-minute-break', category: 'break',
    description: 'Take a short reset with a five-minute timer and gentle prompts.',
    keywords: ['break', 'timer', 'rest', 'focus'], estimatedUsageTime: '5 min', icon: Timer,
    seoTitle: '5-Minute Break Timer', seoDescription: 'Start a simple five-minute break timer with no sign-in required.', status: 'available',
  },
  {
    id: 'daily-trivia', name: 'Daily Trivia', slug: 'daily-trivia', category: 'discover',
    description: 'Try a quick original trivia question and reveal the answer.',
    keywords: ['trivia', 'daily', 'quiz', 'question'], estimatedUsageTime: '1 min', icon: Lightbulb,
    seoTitle: 'Daily Trivia', seoDescription: 'Answer a short, original daily trivia question and learn the explanation.', status: 'available',
  },
  {
    id: 'interesting-facts', name: 'Interesting Facts', slug: 'interesting-facts', category: 'discover',
    description: 'Browse a small collection of interesting, source-checked facts.',
    keywords: ['facts', 'curiosity', 'learning'], estimatedUsageTime: '2 min', icon: Radio,
    seoTitle: 'Interesting Facts', seoDescription: 'Explore a curated collection of concise facts with source notes.', status: 'available',
  },
  {
    id: 'office-humor', name: 'Office Humor', slug: 'office-humor', category: 'discover',
    description: 'Take a light-hearted work break with original office humor.',
    keywords: ['office', 'humor', 'work', 'jokes'], estimatedUsageTime: '1 min', icon: Gamepad2,
    seoTitle: 'Office Humor', seoDescription: 'Read original, light-hearted office humor for a quick workday break.', status: 'available',
  },
  {
    id: 'quick-quiz', name: 'Quick Quiz', slug: 'quick-quiz', category: 'discover',
    description: 'Try a short quiz and check your results immediately.',
    keywords: ['quiz', 'quick', 'knowledge'], estimatedUsageTime: '2 min', icon: ListChecks,
    seoTitle: 'Quick Quiz', seoDescription: 'Take a short, original quiz and get an instant score and explanations.', status: 'available',
  },
]

export function getTool(category: ToolCategory, slug: string) {
  return tools.find((tool) => tool.category === category && tool.slug === slug)
}

export function getTools(category?: ToolCategory) {
  return category ? tools.filter((tool) => tool.category === category) : tools
}

export function getToolPath(tool: ToolDefinition, locale: ProductLocale = 'en') {
  return `/${locale}/${tool.category}/${tool.slug}`
}

export function getLocalizedCategory(category: ToolCategory, locale: ProductLocale) {
  const name = getProductText(locale, `category.${category}` as MessageKey)
  const description = getProductText(locale, `category.${category}Description` as MessageKey)
  return { name, description }
}

export function getLocalizedTool(tool: ToolDefinition, locale: ProductLocale) {
  return {
    ...tool,
    name: getToolText(locale, tool.id, 'name'),
    description: getToolText(locale, tool.id, 'description'),
  }
}
