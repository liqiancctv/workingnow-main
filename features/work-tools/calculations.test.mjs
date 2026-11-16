import assert from 'node:assert/strict'
import test from 'node:test'
import {
  compareLines, convertCase, countText, generateTeams, growthRate, parseList,
  percentageChange, percentageOf, pickItems, shuffle,
} from './calculations.ts'

test('percentages and compound growth validate their domains', () => {
  assert.equal(percentageOf(15, 200), 30)
  assert.equal(percentageChange(100, 80), -20)
  assert.equal(percentageChange(-100, -50), 50)
  assert.throws(() => percentageChange(0, 3), /zero/)
  assert.throws(() => percentageOf(Infinity, 1), /valid/)
  const growth = growthRate(100, 121, 2)
  assert.equal(growth.total, 21)
  assert.ok(Math.abs(growth.perPeriod - 10) < 1e-10)
  assert.equal(growthRate(100, 0, 3).perPeriod, -100)
  assert.throws(() => growthRate(-1, 2, 1), /positive/)
  assert.throws(() => growthRate(1, 2, 1.5), /whole/)
})

test('counts multilingual words and Unicode code points with documented rules', () => {
  const counts = countText("Hello中文 world! こんにちは。\n\nDon't stop. 😀")
  assert.equal(counts.words, 11)
  assert.equal(counts.sentences, 3)
  assert.equal(counts.paragraphs, 2)
  assert.equal(counts.characters, Array.from("Hello中文 world! こんにちは。\n\nDon't stop. 😀").length)
  assert.equal(countText('😀').characters, 1)
  assert.equal(countText('   \n\n').paragraphs, 0)
  assert.equal(countText('中文abc').words, 3)
})

test('case conversion handles punctuation, apostrophes, and Unicode letters', () => {
  assert.equal(convertCase('Hello World', 'upper'), 'HELLO WORLD')
  assert.equal(convertCase('Hello World', 'lower'), 'hello world')
  assert.equal(convertCase("hELLO o'BRIEN", 'title'), "Hello O'brien")
  assert.equal(convertCase('HELLO!  WORLD。 ÉCOLE?', 'sentence'), 'Hello!  World。 École?')
})

test('line diff reports changes, line endings, and oversized input', () => {
  assert.deepEqual(compareLines('a\nb\nc', 'a\nx\nc'), [
    { type: 'same', text: 'a' }, { type: 'delete', text: 'b' },
    { type: 'insert', text: 'x' }, { type: 'same', text: 'c' },
  ])
  assert.deepEqual(compareLines('', 'new'), [{ type: 'insert', text: 'new' }])
  assert.deepEqual(compareLines('a\r\nb', 'a\nb').map((line) => line.type), ['same', 'same'])
  assert.throws(() => compareLines('a\n'.repeat(1000), 'b\n'.repeat(1000)), /too many lines/)
})

test('teams are balanced, preserve entries and respect group count or size', () => {
  const items = parseList(' A \nB\n\nC\nD\nE ')
  assert.deepEqual(items, ['A', 'B', 'C', 'D', 'E'])
  assert.deepEqual(shuffle(items, () => 0), ['B', 'C', 'D', 'E', 'A'])
  for (const [mode, amount] of [['count', 2], ['size', 3]]) {
    const groups = generateTeams(items, mode, amount, () => 0)
    assert.deepEqual(groups.map((group) => group.length), [3, 2])
    assert.deepEqual(groups.flat().sort(), [...items].sort())
  }
  assert.throws(() => generateTeams(items, 'count', 6), /cannot exceed/)
  assert.throws(() => generateTeams([], 'size', 1), /participant/)
})

test('picker supports repeated draws and unique entries without repeats', () => {
  assert.deepEqual(pickItems(['A', 'B'], 3, true, () => 0), ['A', 'A', 'A'])
  assert.deepEqual(pickItems(['A', 'B', 'C'], 3, false, () => 0), ['B', 'C', 'A'])
  assert.throws(() => pickItems(['A'], 2, false), /not enough/)
  assert.throws(() => pickItems(['A'], 10001, true), /10,000/)
  assert.throws(() => pickItems(['A'], 1, true, () => 1), /Random values/)
})
