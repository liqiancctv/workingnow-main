'use client'

import { useRef, useState, type ReactNode } from 'react'
import { trackProductEvent } from '@/lib/analytics/events'
import { useProductLocale } from '@/components/product/product-i18n-provider'
import { translateProductPhrase } from '@/lib/product-i18n'
import {
  compareLines, convertCase, countText, generateTeams, growthRate, parseList,
  percentageChange, percentageOf, pickItems, type CaseMode, type DiffLine,
} from './calculations'

const inputClass = 'min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
const buttonClass = 'min-h-10 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50'
const secondaryClass = 'min-h-10 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50'

function usePhrase() {
  const locale = useProductLocale()
  return (source: string) => translateProductPhrase(locale, source)
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h2 className="text-lg font-semibold text-slate-900">{title}</h2><div className="mt-4 grid gap-4">{children}</div></div>
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid gap-1.5 text-sm font-medium text-slate-700">{label}{children}</label>
}

function NumberField({ label, value, onChange, min, step = 'any' }: { label: string; value: string; onChange: (value: string) => void; min?: string; step?: string }) {
  return <Field label={label}><input className={inputClass} type="number" value={value} min={min} step={step} onChange={(event) => onChange(event.target.value)} /></Field>
}

function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <Field label={label}><textarea className={`${inputClass} min-h-40 resize-y`} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></Field>
}

function CopyResult({ text, toolId }: { text: string; toolId: string }) {
  const t = usePhrase()
  const [message, setMessage] = useState('')
  const [fallback, setFallback] = useState(false)
  async function copy() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(text)
      setFallback(false)
      setMessage(t('Copied.'))
      trackProductEvent('tool_copy', { tool_id: toolId, tool_category: 'tools' })
    } catch {
      setFallback(true)
      setMessage(t('Copy failed. Select and copy the text below manually.'))
    }
  }
  return <div className="grid gap-2">
    <div><button type="button" className={secondaryClass} onClick={copy} disabled={!text}>Copy result</button></div>
    {message && <p role="status" className="text-sm text-slate-700">{message}</p>}
    {fallback && <Field label="Manual copy"><textarea className={`${inputClass} min-h-32`} readOnly value={text} onFocus={(event) => event.currentTarget.select()} /></Field>}
  </div>
}

function ErrorMessage({ message }: { message: string }) {
  return message ? <p role="alert" className="text-sm text-red-700">{message}</p> : null
}

function readNumber(value: string) {
  if (!value.trim() || !Number.isFinite(Number(value))) throw new Error('Enter valid numbers in all fields.')
  return Number(value)
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 10 }).format(value)
}

function messageFrom(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.'
}

export function WorkTool({ slug }: { slug: string }) {
  const t = usePhrase()
  switch (slug) {
    case 'percentage-calculator': return <PercentageCalculator />
    case 'growth-rate-calculator': return <GrowthCalculator />
    case 'word-counter': return <WordCounter />
    case 'text-case-converter': return <CaseConverter />
    case 'text-compare': return <TextCompare />
    case 'random-team-generator': return <TeamGenerator />
    case 'random-picker': return <RandomPicker />
    default: return <p role="alert">{t('This tool is not available yet.')}</p>
  }
}

function PercentageCalculator() {
  const t = usePhrase()
  const [mode, setMode] = useState<'of' | 'change'>('of')
  const [first, setFirst] = useState('')
  const [second, setSecond] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  function clearResult() { setResult(''); setError('') }
  function calculate() {
    trackProductEvent('tool_use', { tool_id: 'percentage-calculator', tool_category: 'tools' })
    try {
      const a = readNumber(first)
      const b = readNumber(second)
      setResult(mode === 'of' ? formatNumber(percentageOf(a, b)) : `${formatNumber(percentageChange(a, b))}%`)
      setError('')
      trackProductEvent('tool_complete', { tool_id: 'percentage-calculator', tool_category: 'tools' })
    } catch (cause) { setResult(''); setError(t(messageFrom(cause))) }
  }
  return <Section title={t('Percentage calculator')}>
    <Field label={t('Calculation')}><select className={inputClass} value={mode} onChange={(event) => { setMode(event.target.value as 'of' | 'change'); clearResult() }}><option value="of">{t('Percentage of a value')}</option><option value="change">{t('Percentage change')}</option></select></Field>
    <div className="grid gap-4 sm:grid-cols-2">
      <NumberField label={t(mode === 'of' ? 'Percentage' : 'Starting value')} value={first} onChange={(value) => { setFirst(value); clearResult() }} />
      <NumberField label={t(mode === 'of' ? 'Value' : 'Ending value')} value={second} onChange={(value) => { setSecond(value); clearResult() }} />
    </div>
    {mode === 'change' && <p className="text-sm text-slate-600">{t('Change is measured against the absolute starting value; zero is not a valid starting value.')}</p>}
    <div><button className={buttonClass} type="button" onClick={calculate}>{t('Calculate')}</button></div>
    <ErrorMessage message={error} />
    {result && <p aria-live="polite" className="text-lg font-semibold">{t('Result:')} {result}</p>}
  </Section>
}

function GrowthCalculator() {
  const t = usePhrase()
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [periods, setPeriods] = useState('1')
  const [result, setResult] = useState<{ total: number; perPeriod: number } | null>(null)
  const [error, setError] = useState('')
  function clearResult() { setResult(null); setError('') }
  function calculate() {
    trackProductEvent('tool_use', { tool_id: 'growth-rate-calculator', tool_category: 'tools' })
    try {
      setResult(growthRate(readNumber(start), readNumber(end), readNumber(periods)))
      setError('')
      trackProductEvent('tool_complete', { tool_id: 'growth-rate-calculator', tool_category: 'tools' })
    }
    catch (cause) { setResult(null); setError(t(messageFrom(cause))) }
  }
  return <Section title={t('Growth rate calculator')}>
    <div className="grid gap-4 sm:grid-cols-3">
      <NumberField label={t('Starting value')} value={start} onChange={(value) => { setStart(value); clearResult() }} />
      <NumberField label={t('Ending value')} value={end} onChange={(value) => { setEnd(value); clearResult() }} />
      <NumberField label={t('Number of periods')} value={periods} min="1" step="1" onChange={(value) => { setPeriods(value); clearResult() }} />
    </div>
    <p className="text-sm text-slate-600">{t('The per-period rate is compounded: (ending value / starting value)^(1 / periods) − 1.')}</p>
    <div><button className={buttonClass} type="button" onClick={calculate}>{t('Calculate')}</button></div>
    <ErrorMessage message={error} />
    {result && <div aria-live="polite" className="grid gap-1 font-semibold"><p>{t('Total growth:')} {formatNumber(result.total)}%</p><p>{t('Compound growth per period:')} {formatNumber(result.perPeriod)}%</p></div>}
  </Section>
}

function WordCounter() {
  const t = usePhrase()
  const [text, setText] = useState('')
  const trackedInput = useRef(false)
  const counts = countText(text)
  return <Section title={t('Word counter')}>
    <TextField label={t('Text')} value={text} onChange={(value) => {
      setText(value)
      if (value && !trackedInput.current) {
        trackedInput.current = true
        trackProductEvent('tool_use', { tool_id: 'word-counter', tool_category: 'tools' })
      }
    }} placeholder={t('Type or paste text here')} />
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">{Object.entries({
      Words: counts.words, Characters: counts.characters, 'Characters without spaces': counts.charactersWithoutWhitespace,
      Sentences: counts.sentences, Paragraphs: counts.paragraphs,
    }).map(([label, count]) => <div key={label} className="rounded-lg bg-slate-50 p-3"><dt className="text-sm text-slate-600">{t(label)}</dt><dd className="text-xl font-semibold tabular-nums">{count}</dd></div>)}</dl>
    <p className="text-sm text-slate-600">{t('Words are runs of letters or numbers (including internal apostrophes); each Han, Hiragana, or Katakana character counts separately, even next to another word. Other scripts without spaces count as one run. Characters count Unicode code points, including whitespace; sentences use . ! ? 。 ！ ？ and paragraphs are separated by blank lines.')}</p>
    <div><button type="button" className={secondaryClass} onClick={() => setText('')}>{t('Reset')}</button></div>
  </Section>
}

function CaseConverter() {
  const t = usePhrase()
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const modes: { label: string; value: CaseMode }[] = [
    { label: 'UPPERCASE', value: 'upper' }, { label: 'lowercase', value: 'lower' },
    { label: 'Title Case', value: 'title' }, { label: 'Sentence case', value: 'sentence' },
  ]
  return <Section title={t('Text case converter')}>
    <TextField label={t('Original text')} value={text} onChange={(value) => { setText(value); setResult('') }} placeholder={t('Type or paste text here')} />
    <div className="flex flex-wrap gap-2">{modes.map(({ label, value }) => <button key={value} type="button" className={buttonClass} onClick={() => { trackProductEvent('tool_use', { tool_id: 'text-case-converter', tool_category: 'tools' }); setResult(convertCase(text, value)); trackProductEvent('tool_complete', { tool_id: 'text-case-converter', tool_category: 'tools' }) }}>{t(label)}</button>)}</div>
    <Field label={t('Converted text')}><textarea className={`${inputClass} min-h-40`} readOnly value={result} /></Field>
    <CopyResult key={result} text={result} toolId="text-case-converter" />
    <div><button type="button" className={secondaryClass} onClick={() => { setText(''); setResult('') }}>{t('Reset')}</button></div>
  </Section>
}

function TextCompare() {
  const t = usePhrase()
  const [original, setOriginal] = useState('')
  const [revised, setRevised] = useState('')
  const [diff, setDiff] = useState<DiffLine[] | null>(null)
  const [error, setError] = useState('')
  function clearResult() { setDiff(null); setError('') }
  function compare() {
    trackProductEvent('tool_use', { tool_id: 'text-compare', tool_category: 'tools' })
    try {
      setDiff(compareLines(original, revised))
      setError('')
      trackProductEvent('tool_complete', { tool_id: 'text-compare', tool_category: 'tools' })
    }
    catch (cause) { setDiff(null); setError(t(messageFrom(cause))) }
  }
  const result = diff?.map((line) => `${line.type === 'insert' ? '+' : line.type === 'delete' ? '-' : ' '} ${line.text}`).join('\n') ?? ''
  return <Section title={t('Compare text')}>
    <div className="grid gap-4 sm:grid-cols-2">
      <TextField label={t('Original text')} value={original} onChange={(value) => { setOriginal(value); clearResult() }} />
      <TextField label={t('Revised text')} value={revised} onChange={(value) => { setRevised(value); clearResult() }} />
    </div>
    <div className="flex flex-wrap gap-2"><button type="button" className={buttonClass} onClick={compare}>{t('Compare')}</button><button type="button" className={secondaryClass} onClick={() => { setOriginal(''); setRevised(''); clearResult() }}>{t('Reset')}</button></div>
    <ErrorMessage message={error} />
    {diff && <div className="grid gap-3">
      <p className="text-sm text-slate-600">{t('Lines prefixed + are inserted; lines prefixed − are deleted.')}</p>
      {diff.length ? <pre aria-label={t('Comparison result')} className="overflow-x-auto rounded-lg border border-slate-200 text-sm">{diff.map((line, index) => <span key={index} className={`block whitespace-pre-wrap break-words px-3 py-0.5 ${line.type === 'insert' ? 'bg-green-50 text-green-900' : line.type === 'delete' ? 'bg-red-50 text-red-900' : 'text-slate-700'}`}>{line.type === 'insert' ? '+' : line.type === 'delete' ? '−' : ' '} {line.text || '\u00a0'}</span>)}</pre> : <p className="text-sm text-slate-600">{t('Both texts are empty.')}</p>}
      <CopyResult key={result} text={result} toolId="text-compare" />
    </div>}
  </Section>
}

function TeamGenerator() {
  const t = usePhrase()
  const [text, setText] = useState('')
  const [mode, setMode] = useState<'count' | 'size'>('count')
  const [amount, setAmount] = useState('2')
  const [teams, setTeams] = useState<string[][] | null>(null)
  const [error, setError] = useState('')
  function clearResult() { setTeams(null); setError('') }
  function generate() {
    trackProductEvent('tool_use', { tool_id: 'random-team-generator', tool_category: 'tools' })
    try {
      setTeams(generateTeams(parseList(text), mode, readNumber(amount)))
      setError('')
      trackProductEvent('tool_complete', { tool_id: 'random-team-generator', tool_category: 'tools' })
    }
    catch (cause) { setTeams(null); setError(t(messageFrom(cause))) }
  }
  const result = teams?.map((team, index) => `${t(`Group ${index + 1}`)}\n${team.join('\n')}`).join('\n\n') ?? ''
  return <Section title={t('Random team generator')}>
    <TextField label={t('Participants (one per line)')} value={text} onChange={(value) => { setText(value); clearResult() }} placeholder={t('Alex\nSam\nTaylor')} />
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label={t('Group by')}><select className={inputClass} value={mode} onChange={(event) => { setMode(event.target.value as 'count' | 'size'); clearResult() }}><option value="count">{t('Number of groups')}</option><option value="size">{t('Maximum group size')}</option></select></Field>
      <NumberField label={t(mode === 'count' ? 'Number of groups' : 'Maximum group size')} value={amount} min="1" step="1" onChange={(value) => { setAmount(value); clearResult() }} />
    </div>
    <p className="text-sm text-slate-600">{t('Groups are balanced as evenly as possible. Duplicate lines are treated as separate participants.')}</p>
    <div className="flex flex-wrap gap-2"><button type="button" className={buttonClass} onClick={generate}>{t(teams ? 'Reshuffle' : 'Generate groups')}</button><button type="button" className={secondaryClass} onClick={() => { setText(''); setAmount('2'); setMode('count'); clearResult() }}>{t('Reset')}</button></div>
    <ErrorMessage message={error} />
    {teams && <><div className="grid gap-3 sm:grid-cols-2">{teams.map((team, index) => <div key={index} className="rounded-lg bg-slate-50 p-3"><h3 className="font-semibold">{t(`Group ${index + 1}`)}</h3><ul className="mt-1 break-words text-sm">{team.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</ul></div>)}</div><CopyResult key={result} text={result} toolId="random-team-generator" /></>}
  </Section>
}

function RandomPicker() {
  const t = usePhrase()
  const [text, setText] = useState('')
  const [count, setCount] = useState('1')
  const [allowRepeats, setAllowRepeats] = useState(false)
  const [remaining, setRemaining] = useState<number[] | null>(null)
  const [picked, setPicked] = useState<string[] | null>(null)
  const [error, setError] = useState('')
  function clearResult() { setRemaining(null); setPicked(null); setError('') }
  function pick() {
    trackProductEvent('tool_use', { tool_id: 'random-picker', tool_category: 'tools' })
    try {
      const items = parseList(text)
      const pool = remaining ?? items.map((_, index) => index)
      if (!allowRepeats && items.length && !pool.length) throw new Error('All entries have been picked. Reset the draw to start again.')
      const indices = pickItems(allowRepeats ? items.map((_, index) => String(index)) : pool.map(String), readNumber(count), allowRepeats).map(Number)
      setPicked(indices.map((index) => items[index]))
      if (!allowRepeats) setRemaining(pool.filter((index) => !indices.includes(index)))
      setError('')
      trackProductEvent('tool_complete', { tool_id: 'random-picker', tool_category: 'tools' })
    } catch (cause) { setPicked(null); setError(t(messageFrom(cause))) }
  }
  const result = picked?.join('\n') ?? ''
  return <Section title={t('Random picker')}>
    <TextField label={t('Items (one per line)')} value={text} onChange={(value) => { setText(value); clearResult() }} placeholder={t('Option A\nOption B\nOption C')} />
    <NumberField label={t('Number of picks')} value={count} min="1" step="1" onChange={(value) => { setCount(value); setPicked(null); setError('') }} />
    <label className="flex items-center gap-2 text-sm font-medium text-slate-700"><input type="checkbox" checked={allowRepeats} onChange={(event) => { setAllowRepeats(event.target.checked); clearResult() }} />{t('Allow repeats')}</label>
    <p className="text-sm text-slate-600">{t('Without repeats, selected entries are removed from the pool until reset or the list changes. Duplicate lines are separate entries.')}{remaining && !allowRepeats ? ` ${remaining.length} ${t('remaining.')}` : ''}</p>
    <div className="flex flex-wrap gap-2"><button type="button" className={buttonClass} onClick={pick}>{t('Pick')}</button><button type="button" className={secondaryClass} onClick={clearResult}>{t('Reset draw')}</button><button type="button" className={secondaryClass} onClick={() => { setText(''); setCount('1'); setAllowRepeats(false); clearResult() }}>{t('Clear all')}</button></div>
    <ErrorMessage message={error} />
    {picked && <><div aria-live="polite" className="rounded-lg bg-slate-50 p-3"><h3 className="font-semibold">{t('Selected')}</h3><ol className="mt-1 break-words text-sm">{picked.map((item, index) => <li key={index}>{item}</li>)}</ol></div><CopyResult key={result} text={result} toolId="random-picker" /></>}
  </Section>
}
