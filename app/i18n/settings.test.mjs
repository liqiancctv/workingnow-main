import assert from 'node:assert/strict'
import test from 'node:test'
import { detectProductLocale } from './settings.ts'

test('detects the four supported browser languages and Chinese scripts', () => {
  assert.equal(detectProductLocale('en-US,en;q=0.9'), 'en')
  assert.equal(detectProductLocale('zh-CN,zh;q=0.9'), 'zh-CN')
  assert.equal(detectProductLocale('zh-TW,zh;q=0.9'), 'zh-TW')
  assert.equal(detectProductLocale('zh-Hant-HK'), 'zh-TW')
  assert.equal(detectProductLocale('zh-Hant'), 'zh-TW')
  assert.equal(detectProductLocale('ja-JP'), 'ja')
})

test('uses quality weights and keeps header order for ties', () => {
  assert.equal(detectProductLocale('en;q=0.2,ja;q=0.9,zh-CN;q=0.8'), 'ja')
  assert.equal(detectProductLocale('fr;q=1,zh-TW;q=0.6,en;q=0.6'), 'zh-TW')
})

test('ignores unsupported, wildcard, zero-weight, and invalid preferences', () => {
  assert.equal(detectProductLocale('fr, de;q=0.8, *;q=0.7'), 'en')
  assert.equal(detectProductLocale('zh-TW;q=0,ja;q=0'), 'en')
  assert.equal(detectProductLocale('ja;q=2,zh-CN;q=broken,en'), 'en')
  assert.equal(detectProductLocale(null), 'en')
})
