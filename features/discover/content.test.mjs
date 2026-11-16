import assert from 'node:assert/strict'
import test from 'node:test'
import { dailyTriviaIndex, discoverSlugs, facts, humor, isDiscoverSlug, quiz, trivia } from './content.ts'

test('only the four discover slugs are supported', () => {
  assert.equal(discoverSlugs.length, 4)
  for (const slug of discoverSlugs) assert.equal(isDiscoverSlug(slug), true)
  assert.equal(isDiscoverSlug('unknown'), false)
})

test('daily trivia rotates deterministically by UTC day and repeats', () => {
  const start = Date.UTC(2026, 0, 1)
  assert.equal(dailyTriviaIndex(new Date(start)), dailyTriviaIndex(new Date(start + 86_399_999)))
  assert.equal(dailyTriviaIndex(new Date(start + 86_400_000)), (dailyTriviaIndex(new Date(start)) + 1) % trivia.length)
  assert.equal(dailyTriviaIndex(new Date(start + trivia.length * 86_400_000)), dailyTriviaIndex(new Date(start)))
  assert.ok(dailyTriviaIndex(new Date('1969-12-31T00:00:00Z')) >= 0)
})

test('content has unique IDs, attribution and valid questions', () => {
  const items = [...trivia, ...quiz, ...facts, ...humor]
  assert.equal(new Set(items.map((item) => item.id)).size, items.length)
  for (const item of items) {
    assert.ok(item.category && item.author && item.rights && item.published)
    for (const source of item.sources) assert.equal(new URL(source.url).protocol, 'https:')
  }
  for (const question of [...trivia, ...quiz]) {
    assert.ok(question.question && question.explanation)
    assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < question.options.length)
    assert.equal(new Set(question.options).size, question.options.length)
  }
  for (const item of [...trivia, ...facts]) assert.ok(item.sources.length > 0)
})
