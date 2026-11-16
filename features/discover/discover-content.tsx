'use client'

import { useState, useSyncExternalStore } from 'react'
import { trackProductEvent } from '@/lib/analytics/events'
import { useProductLocale } from '@/components/product/product-i18n-provider'
import { translateProductPhrase } from '@/lib/product-i18n'
import { dailyTriviaIndex, facts, humor, quiz, trivia, type DiscoverSlug, type Question } from './content'

const button = 'min-h-11 rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 disabled:cursor-not-allowed disabled:opacity-50'
const secondary = 'min-h-11 rounded-lg border border-slate-400 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 disabled:cursor-not-allowed disabled:opacity-50'
const card = 'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6'

function usePhrase() {
  const locale = useProductLocale()
  return (source: string, values?: Record<string, string | number>) => translateProductPhrase(locale, source, values)
}

function utcDay() {
  return new Date().toISOString().slice(0, 10)
}

function subscribeToUtcDay(onChange: () => void) {
  let timer: ReturnType<typeof setTimeout>
  function schedule() {
    const now = Date.now()
    timer = setTimeout(() => {
      onChange()
      schedule()
    }, 86_400_000 - (now % 86_400_000) + 10)
  }
  function checkDay() {
    onChange()
  }
  schedule()
  document.addEventListener('visibilitychange', checkDay)
  return () => {
    clearTimeout(timer)
    document.removeEventListener('visibilitychange', checkDay)
  }
}

function serverDay() { return '' }

function SourceNote({ item }: { item: { author: string; rights: string; published: string; sources: { label: string; url: string }[] } }) {
  const t = usePhrase()
  return (
    <p className="mt-4 text-xs leading-5 text-slate-600">
      {t(item.author)} · {t(item.rights)} · {t('Published {date}', { date: item.published })}
      {item.sources.length > 0 && <> · {t('Source:')} {item.sources.map((source, index) => (
        <span key={source.url}>{index > 0 && ', '}<a className="text-indigo-700 underline" href={source.url} target="_blank" rel="noreferrer">{t(source.label)}</a></span>
      ))}</>}
    </p>
  )
}

function ShareLink({ fragment, label, contentId }: { fragment?: string; label: string; contentId?: string }) {
  const t = usePhrase()
  const [message, setMessage] = useState('')
  const [url, setUrl] = useState('')

  function contentUrl() {
    const link = new URL(window.location.pathname, window.location.origin)
    if (fragment) link.hash = fragment
    return link.toString()
  }

  async function copy() {
    const link = contentUrl()
    setUrl(link)
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard access is unavailable.')
      await navigator.clipboard.writeText(link)
      setMessage('Link copied.')
      trackProductEvent('tool_copy', { content_id: contentId ?? 'discover-page' })
    } catch {
      setMessage('Could not copy the link. Select and copy the URL below instead.')
    }
  }

  async function share() {
    const link = contentUrl()
    setUrl(link)
    try {
      await navigator.share({ title: label, url: link })
      setMessage('Share sheet opened.')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') setMessage('Sharing cancelled.')
      else setMessage('Could not share the link. Select and copy the URL below instead.')
    }
  }

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={secondary} onClick={copy} aria-label={t('Copy link to {label}', { label: t(label) })}>{t('Copy link')}</button>
        <button type="button" className={secondary} onClick={share} aria-label={t('Share {label}', { label: t(label) })}>{t('Share')}</button>
      </div>
      {url && <input aria-label={t('URL for {label}', { label: t(label) })} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700" readOnly value={url} onFocus={(event) => event.currentTarget.select()} />}
      <p role="status" className="mt-2 text-sm text-slate-700">{t(message)}</p>
    </div>
  )
}

function QuestionOptions({ question, selected, onSelect, disabled = false, name }: {
  question: Question; selected: number | undefined; onSelect: (index: number) => void; disabled?: boolean; name: string
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="text-lg font-semibold text-slate-900">{question.question}</legend>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {question.options.map((option, index) => (
          <label key={option} className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-300 p-3 text-sm text-slate-800 has-checked:border-indigo-700 has-checked:bg-indigo-50">
            <input type="radio" name={name} checked={selected === index} disabled={disabled} onChange={() => onSelect(index)} className="accent-indigo-700" />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function DailyTrivia() {
  const t = usePhrase()
  const day = useSyncExternalStore(subscribeToUtcDay, utcDay, serverDay)
  if (!day) return <div className={card}>{t('Loading today’s question…')}</div>
  const question = trivia[dailyTriviaIndex(new Date(`${day}T00:00:00Z`))]
  return <DailyQuestion key={day} question={question} day={day} />
}

function DailyQuestion({ question, day }: { question: Question; day: string }) {
  const t = usePhrase()
  const [selected, setSelected] = useState<number>()
  const [revealed, setRevealed] = useState(false)
  return (
    <div className={card}>
      <p className="mb-3 text-sm font-medium text-indigo-700">{t(question.category)} · {day} UTC</p>
      <QuestionOptions question={{ ...question, question: t(question.question), options: question.options.map((option) => t(option)) }} selected={selected} onSelect={setSelected} disabled={revealed} name="daily-answer" />
      {!revealed && <button type="button" className={`${button} mt-4`} disabled={selected === undefined} onClick={() => {
        setRevealed(true)
        trackProductEvent('tool_use', { tool_id: 'daily-trivia', tool_category: 'discover' })
        trackProductEvent('tool_complete', { tool_id: 'daily-trivia', tool_category: 'discover' })
      }}>{t('Check answer')}</button>}
      {revealed && (
        <div role="status" className="mt-4 rounded-lg bg-indigo-50 p-4 text-sm leading-6 text-slate-800">
          <p className="font-semibold">{selected === question.answer ? t('Correct!') : t('Not quite. The answer is {answer}.', { answer: t(question.options[question.answer]) })}</p>
          <p>{t(question.explanation)}</p>
        </div>
      )}
      <p className="mt-4 text-sm text-slate-600">{t('A question is selected for everyone each UTC day from a small repeating collection.')}</p>
      <SourceNote item={question} />
      <ShareLink label="Daily Trivia" contentId={question.id} />
    </div>
  )
}

function Collection({ kind }: { kind: 'facts' | 'humor' }) {
  const t = usePhrase()
  const items = kind === 'facts' ? facts : humor
  const [category, setCategory] = useState('All')
  const categories = ['All', ...new Set(items.map((item) => item.category))]
  const visible = category === 'All' ? items : items.filter((item) => item.category === category)
  return (
    <div>
      <label htmlFor={`${kind}-category`} className="text-sm font-semibold text-slate-800">{t('Category')}</label>
      <select id={`${kind}-category`} value={category} onChange={(event) => setCategory(event.target.value)} className="ml-3 min-h-11 rounded-lg border border-slate-400 bg-white px-3 text-sm text-slate-800">
        {categories.map((entry) => <option key={entry} value={entry}>{t(entry)}</option>)}
      </select>
      <p className="mt-3 text-sm text-slate-600">{t('{count} {itemLabel}', { count: visible.length, itemLabel: t(visible.length === 1 ? 'item' : 'items') })}</p>
      <div className="mt-4 grid gap-4">
        {visible.map((item) => (
          <article id={item.id} key={item.id} className={`${card} scroll-mt-24`}>
            <p className="text-sm font-medium text-indigo-700">{t(item.category)}</p>
            <p className="mt-2 text-lg leading-7 text-slate-900">{t(item.text)}</p>
            <SourceNote item={item} />
            <ShareLink fragment={item.id} contentId={item.id} label={`${t(kind === 'facts' ? 'fact' : 'office humor')}: ${t(item.text)}`} />
          </article>
        ))}
      </div>
    </div>
  )
}

function QuickQuiz() {
  const t = usePhrase()
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const complete = quiz.every((question) => answers[question.id] !== undefined)
  const score = quiz.filter((question) => answers[question.id] === question.answer).length
  return (
    <div className={card}>
      <p className="text-sm leading-6 text-slate-700">{t('Answer all {count} questions, then check your score and explanations. Your answers stay in this page.', { count: quiz.length })}</p>
      <div className="mt-5 space-y-6">
        {quiz.map((question, index) => (
          <div key={question.id} className="border-t border-slate-200 pt-5">
            <p className="mb-2 text-sm font-medium text-indigo-700">{t('Question {number} · {category}', { number: index + 1, category: t(question.category) })}</p>
            <QuestionOptions question={{ ...question, question: t(question.question), options: question.options.map((option) => t(option)) }} selected={answers[question.id]} name={question.id} disabled={submitted} onSelect={(answer) => setAnswers((previous) => ({ ...previous, [question.id]: answer }))} />
            {submitted && (
              <div className="mt-3 rounded-lg bg-indigo-50 p-3 text-sm leading-6 text-slate-800">
                <p className="font-semibold">{answers[question.id] === question.answer ? t('Correct') : t('Answer: {answer}', { answer: t(question.options[question.answer]) })}</p>
                <p>{t(question.explanation)}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {!submitted && <button type="button" className={button} disabled={!complete} onClick={() => {
          setSubmitted(true)
          trackProductEvent('tool_use', { tool_id: 'quick-quiz', tool_category: 'discover' })
          trackProductEvent('tool_complete', { tool_id: 'quick-quiz', tool_category: 'discover' })
        }}>{t('Check score')}</button>}
        <button type="button" className={secondary} onClick={() => { setAnswers({}); setSubmitted(false) }}>{t('Start over')}</button>
      </div>
      <p role="status" className="mt-3 text-sm font-semibold text-slate-800">{submitted ? t('Your score: {score} / {total}', { score, total: quiz.length }) : t('{answered} / {total} answered', { answered: Object.keys(answers).length, total: quiz.length })}</p>
      <SourceNote item={quiz[0]} />
      <ShareLink label="Quick Quiz" />
    </div>
  )
}

export function DiscoverContent({ slug }: { slug: DiscoverSlug }) {
  switch (slug) {
    case 'daily-trivia': return <DailyTrivia />
    case 'interesting-facts': return <Collection kind="facts" />
    case 'office-humor': return <Collection kind="humor" />
    case 'quick-quiz': return <QuickQuiz />
  }
}
