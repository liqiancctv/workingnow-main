export const discoverSlugs = ['daily-trivia', 'interesting-facts', 'office-humor', 'quick-quiz'] as const
export type DiscoverSlug = typeof discoverSlugs[number]

export function isDiscoverSlug(slug: string): slug is DiscoverSlug {
  return discoverSlugs.some((entry) => entry === slug)
}

type Source = { label: string; url: string }
type ContentRecord = {
  id: string
  category: string
  author: string
  rights: string
  published: string
  sources: Source[]
}

export type Question = ContentRecord & {
  question: string
  options: readonly string[]
  answer: number
  explanation: string
}

type Fact = ContentRecord & { text: string }
type Humor = ContentRecord & { text: string }

const original = { author: 'WorkingNow', rights: 'Original WorkingNow writing', published: '2026-11-16' }

export const trivia: readonly Question[] = [
  { ...original, id: 'venus-day', category: 'Space', question: 'Which planet takes longer to rotate once than it takes to orbit the Sun?', options: ['Mars', 'Venus', 'Mercury', 'Neptune'], answer: 1, explanation: 'Venus rotates very slowly: one rotation takes about 243 Earth days, while its orbit takes about 225.', sources: [{ label: 'NASA: Venus facts', url: 'https://science.nasa.gov/venus/facts/' }] },
  { ...original, id: 'octopus-hearts', category: 'Nature', question: 'How many hearts does an octopus have?', options: ['One', 'Two', 'Three', 'Four'], answer: 2, explanation: 'Two hearts pump blood to the gills and a third pumps it around the body.', sources: [{ label: 'Smithsonian Ocean: octopus', url: 'https://ocean.si.edu/ocean-life/invertebrates/octopus' }] },
  { ...original, id: 'water-freeze', category: 'Science', question: 'At standard atmospheric pressure, what is the freezing point of pure water?', options: ['0°C', '10°C', '32°C', '100°C'], answer: 0, explanation: 'Pure water freezes at 0°C (32°F) at standard atmospheric pressure.', sources: [{ label: 'USGS: water properties', url: 'https://www.usgs.gov/special-topics/water-science-school/science/water-properties-information-topic' }] },
  { ...original, id: 'moon-light', category: 'Space', question: 'Why can we see the Moon shining in the night sky?', options: ['It makes its own visible light', 'It reflects sunlight', 'It reflects city lights', 'It is made of glowing gas'], answer: 1, explanation: 'The Moon does not produce its own visible light; its surface reflects sunlight.', sources: [{ label: 'NASA: Moon facts', url: 'https://science.nasa.gov/moon/facts/' }] },
  { ...original, id: 'bee-dance', category: 'Nature', question: 'What movement can a honey bee use to communicate the direction of food?', options: ['A waggle dance', 'A backward somersault', 'A spiral flight around the hive', 'A jump in place'], answer: 0, explanation: 'The direction and duration of the waggle run help other bees find a food source.', sources: [{ label: 'The Royal Society: honeybee dance communication', url: 'https://royalsocietypublishing.org/doi/10.1098/rsbl.2016.0370' }] },
  { ...original, id: 'earth-layer', category: 'Earth', question: 'Which layer of Earth lies directly beneath the crust?', options: ['Inner core', 'Outer core', 'Mantle', 'Atmosphere'], answer: 2, explanation: 'The mantle lies between the crust and the core.', sources: [{ label: 'USGS: inside the Earth', url: 'https://pubs.usgs.gov/gip/dynamic/inside.html' }] },
]

export const quiz: readonly Question[] = [
  { ...original, id: 'quiz-triangle', category: 'Everyday knowledge', question: 'How many sides do two separate triangles have in total?', options: ['Five', 'Six', 'Seven', 'Eight'], answer: 1, explanation: 'Each triangle has three sides, so two have six.', sources: [] },
  { ...original, id: 'quiz-time', category: 'Everyday knowledge', question: 'A meeting starts at 14:45 and lasts 30 minutes. When does it end?', options: ['15:05', '15:15', '15:30', '14:75'], answer: 1, explanation: 'Fifteen minutes reach 15:00, and another fifteen reach 15:15.', sources: [] },
  { ...original, id: 'quiz-sequence', category: 'Logic', question: 'What number comes next: 2, 4, 8, 16, ...?', options: ['18', '24', '32', '64'], answer: 2, explanation: 'Each number is twice the previous one, so 16 becomes 32.', sources: [] },
  { ...original, id: 'quiz-words', category: 'Words', question: 'Which word is a synonym for “brief”?', options: ['Lengthy', 'Concise', 'Distant', 'Noisy'], answer: 1, explanation: 'Concise and brief both describe something short in expression or duration.', sources: [] },
  { ...original, id: 'quiz-fraction', category: 'Logic', question: 'A team shares 12 pencils equally among 4 people. How many does each person get?', options: ['2', '3', '4', '6'], answer: 1, explanation: 'Dividing 12 by 4 gives 3 pencils per person.', sources: [] },
]

export const facts: readonly Fact[] = [
  { ...original, id: 'fact-venus', category: 'Space', text: 'A single rotation of Venus takes longer than its trip around the Sun.', sources: [{ label: 'NASA: Venus facts', url: 'https://science.nasa.gov/venus/facts/' }] },
  { ...original, id: 'fact-moon', category: 'Space', text: 'The Moon is moving away from Earth by roughly 3.8 centimeters per year.', sources: [{ label: 'NASA: Moon facts', url: 'https://science.nasa.gov/moon/facts/' }] },
  { ...original, id: 'fact-octopus', category: 'Nature', text: 'An octopus has three hearts: two serve the gills and one serves the rest of the body.', sources: [{ label: 'Smithsonian Ocean: octopus', url: 'https://ocean.si.edu/ocean-life/invertebrates/octopus' }] },
  { ...original, id: 'fact-mantle', category: 'Earth', text: 'Earth’s mantle sits between its relatively thin crust and its core.', sources: [{ label: 'USGS: inside the Earth', url: 'https://pubs.usgs.gov/gip/dynamic/inside.html' }] },
  { ...original, id: 'fact-water', category: 'Science', text: 'Ice floats because solid water is less dense than liquid water.', sources: [{ label: 'USGS: water properties', url: 'https://www.usgs.gov/special-topics/water-science-school/science/water-properties-information-topic' }] },
]

export const humor: readonly Humor[] = [
  { ...original, id: 'humor-agenda', category: 'Meetings', text: 'Our meeting has a clear agenda: find the agenda, then schedule a meeting to discuss it.', sources: [] },
  { ...original, id: 'humor-calendar', category: 'Meetings', text: 'My calendar says I have free time. It has clearly never met my inbox.', sources: [] },
  { ...original, id: 'humor-spreadsheet', category: 'Desk life', text: 'I gave my spreadsheet a day off. It still showed up with a lot of cells to fill.', sources: [] },
  { ...original, id: 'humor-coffee', category: 'Desk life', text: 'The coffee machine is our most reliable teammate: it always knows how to filter feedback.', sources: [] },
  { ...original, id: 'humor-status', category: 'Remote work', text: 'My status is “away” because the delivery driver apparently cannot read minds or door numbers.', sources: [] },
  { ...original, id: 'humor-mute', category: 'Remote work', text: 'The most practiced sentence on our team is still “You’re on mute.” We deliver it flawlessly.', sources: [] },
]

export function dailyTriviaIndex(date: Date): number {
  const day = Math.floor(date.getTime() / 86_400_000)
  return ((day % trivia.length) + trivia.length) % trivia.length
}
