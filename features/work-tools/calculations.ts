export function percentageOf(percent: number, value: number) {
  if (!Number.isFinite(percent) || !Number.isFinite(value)) throw new Error('Enter valid numbers.')
  const result = percent / 100 * value
  if (!Number.isFinite(result)) throw new Error('The result is too large to calculate.')
  return result
}

export function percentageChange(start: number, end: number) {
  if (!Number.isFinite(start) || !Number.isFinite(end)) throw new Error('Enter valid numbers.')
  if (start === 0) throw new Error('The starting value cannot be zero.')
  const result = (end - start) / Math.abs(start) * 100
  if (!Number.isFinite(result)) throw new Error('The result is too large to calculate.')
  return result
}

export function growthRate(start: number, end: number, periods: number) {
  if (!Number.isFinite(start) || !Number.isFinite(end)) throw new Error('Enter valid numbers.')
  if (start <= 0 || end < 0) throw new Error('Growth requires a positive starting value and a non-negative ending value.')
  if (!Number.isSafeInteger(periods) || periods < 1) throw new Error('Periods must be a positive whole number.')
  const total = percentageChange(start, end)
  const perPeriod = (Math.pow(end / start, 1 / periods) - 1) * 100
  if (!Number.isFinite(perPeriod)) throw new Error('The result is too large to calculate.')
  return { total, perPeriod }
}

export function countText(text: string) {
  // The token pattern below deliberately treats CJK characters separately from adjacent words.
  const tokens = text.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]|(?:(?![\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}])[\p{L}\p{N}\p{M}])+(?:['’](?:(?![\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}])[\p{L}\p{N}\p{M}])+)*/gu) ?? []
  return {
    characters: Array.from(text).length,
    charactersWithoutWhitespace: Array.from(text).filter((character) => !/\s/u.test(character)).length,
    words: tokens.length,
    sentences: text.split(/[.!?。！？]+/u).filter((part) => /[\p{L}\p{N}]/u.test(part)).length,
    paragraphs: text.split(/\r?\n\s*\r?\n/u).filter((part) => part.trim()).length,
  }
}

export type CaseMode = 'upper' | 'lower' | 'title' | 'sentence'

export function convertCase(text: string, mode: CaseMode) {
  if (mode === 'upper') return text.toUpperCase()
  if (mode === 'lower') return text.toLowerCase()
  const lower = text.toLowerCase()
  if (mode === 'title') {
    return lower.replace(/[\p{L}\p{N}\p{M}]+(?:['’][\p{L}\p{N}\p{M}]+)*/gu, (word) =>
      word.replace(/\p{L}/u, (letter) => letter.toUpperCase()))
  }
  return lower.replace(/(^|[.!?。！？]\s*)([^\p{L}]*)(\p{L})/gu,
    (_match, prefix: string, before: string, letter: string) => prefix + before + letter.toUpperCase())
}

export type DiffLine = { type: 'same' | 'insert' | 'delete'; text: string }

export function compareLines(original: string, revised: string): DiffLine[] {
  const a = original === '' ? [] : original.split(/\r\n|\n|\r/u)
  const b = revised === '' ? [] : revised.split(/\r\n|\n|\r/u)
  if ((a.length + 1) * (b.length + 1) > 1_000_000) {
    throw new Error('These texts have too many lines to compare. Try smaller texts.')
  }
  const width = b.length + 1
  const lengths = new Uint32Array((a.length + 1) * width)
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lengths[i * width + j] = a[i] === b[j]
        ? lengths[(i + 1) * width + j + 1] + 1
        : Math.max(lengths[(i + 1) * width + j], lengths[i * width + j + 1])
    }
  }
  const result: DiffLine[] = []
  let i = 0
  let j = 0
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) {
      result.push({ type: 'same', text: a[i++] })
      j++
    } else if (i < a.length && (j === b.length || lengths[(i + 1) * width + j] >= lengths[i * width + j + 1])) {
      result.push({ type: 'delete', text: a[i++] })
    } else {
      result.push({ type: 'insert', text: b[j++] })
    }
  }
  return result
}

export function parseList(text: string) {
  return text.split(/\r?\n/u).map((item) => item.trim()).filter(Boolean)
}

export function shuffle<T>(items: readonly T[], random: () => number = Math.random) {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const value = random()
    if (!(value >= 0 && value < 1)) throw new Error('Random values must be between 0 and 1.')
    const j = Math.floor(value * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function generateTeams(items: readonly string[], mode: 'count' | 'size', amount: number, random: () => number = Math.random) {
  if (!items.length) throw new Error('Enter at least one participant.')
  if (!Number.isSafeInteger(amount) || amount < 1) throw new Error('Enter a positive whole number.')
  if (mode === 'count' && amount > items.length) throw new Error('The number of groups cannot exceed the number of participants.')
  const count = mode === 'count' ? amount : Math.ceil(items.length / amount)
  const groups: string[][] = Array.from({ length: count }, () => [])
  shuffle(items, random).forEach((item, index) => groups[index % count].push(item))
  return groups
}

export function pickItems(items: readonly string[], count: number, allowRepeats: boolean, random: () => number = Math.random) {
  if (!items.length) throw new Error('Enter at least one item.')
  if (!Number.isSafeInteger(count) || count < 1) throw new Error('Enter a positive whole number of picks.')
  if (count > 10_000) throw new Error('Choose at most 10,000 picks at a time.')
  if (!allowRepeats && count > items.length) throw new Error('There are not enough items for picks without repeats.')
  if (!allowRepeats) return shuffle(items, random).slice(0, count)
  return Array.from({ length: count }, () => {
    const value = random()
    if (!(value >= 0 && value < 1)) throw new Error('Random values must be between 0 and 1.')
    return items[Math.floor(value * items.length)]
  })
}
