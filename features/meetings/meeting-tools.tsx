'use client'

import { useEffect, useMemo, useState } from 'react'
import { useVersionedStore } from '@/lib/storage/versioned-store'
import { trackProductEvent } from '@/lib/analytics/events'
import { useProductLocale } from '@/components/product/product-i18n-provider'
import { translateProductPhrase } from '@/lib/product-i18n'
import {
  addElapsedTime,
  calculateWorkingDays,
  findMeetingCandidates,
  formatZonedDateTime,
  formatZonedTime,
  getTimezoneOffsetLabel,
  isValidTimeZone,
  resolveLocalDateTime,
  type PlannerParticipant,
} from './calculations'

const fallbackZoneNames = ['UTC', 'America/Los_Angeles', 'America/New_York', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Australia/Sydney']

function getAvailableTimeZones() {
  try {
    return typeof Intl.supportedValuesOf === 'function'
      ? ['UTC', ...Intl.supportedValuesOf('timeZone')]
      : fallbackZoneNames
  } catch {
    return fallbackZoneNames
  }
}

function useTimeZones() {
  const [zones, setZones] = useState(fallbackZoneNames)
  useEffect(() => {
    const initialize = window.setTimeout(() => setZones(getAvailableTimeZones()), 0)
    return () => window.clearTimeout(initialize)
  }, [])
  return zones
}

const defaultZones = ['America/Los_Angeles', 'America/New_York', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Australia/Sydney']
const worldClockKey = 'workingnow.world-clock'
type WorldClockSettings = { zones: string[]; hour12: boolean; favorites: string[] }
const defaultWorldClockSettings: WorldClockSettings = {
  zones: defaultZones,
  hour12: false,
  favorites: [],
}
function isWorldClockSettings(value: unknown): value is WorldClockSettings {
  if (typeof value !== 'object' || value === null) return false
  const settings = value as Partial<WorldClockSettings>
  return Array.isArray(settings.zones) &&
    settings.zones.every((zone) => typeof zone === 'string' && isValidTimeZone(zone)) &&
    typeof settings.hour12 === 'boolean' &&
    Array.isArray(settings.favorites) &&
    settings.favorites.every((zone) => typeof zone === 'string' && isValidTimeZone(zone))
}
const defaultParticipants: PlannerParticipant[] = [
  { id: 'you', name: 'You', timeZone: 'America/Los_Angeles', startHour: 9, endHour: 17 },
  { id: 'participant-2', name: 'Participant 2', timeZone: 'Europe/London', startHour: 9, endHour: 17 },
]

function localDateTimeInput(date = new Date()) {
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

function localDateInput(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function zoneLabel(zone: string) {
  return zone.replaceAll('_', ' ').replaceAll('/', ' / ')
}

function usePhrase() {
  const locale = useProductLocale()
  return (source: string) => translateProductPhrase(locale, source)
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-slate-700">
      {label}
      {children}
    </label>
  )
}

const inputClass = 'min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
const buttonClass = 'min-h-10 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50'
const secondaryButtonClass = 'min-h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50'

function TimeZoneSelect({ value, onChange, label = 'Time zone' }: { value: string; onChange: (value: string) => void; label?: string }) {
  const t = usePhrase()
  const zoneNames = useTimeZones()
  return (
    <Field label={t(label)}>
      <select className={inputClass} value={value} onChange={(event) => onChange(event.target.value)}>
        {!zoneNames.includes(value) && <option value={value}>{zoneLabel(value)}</option>}
        {zoneNames.map((zone) => <option key={zone} value={zone}>{zoneLabel(zone)}</option>)}
      </select>
    </Field>
  )
}

export function MeetingTool({ slug }: { slug: string }) {
  switch (slug) {
    case 'world-clock': return <WorldClock />
    case 'time-zone-converter': return <TimeZoneConverter />
    case 'meeting-planner': return <MeetingPlanner />
    case 'meeting-countdown': return <MeetingCountdown />
    case 'meeting-timer': return <MeetingTimer />
    case 'working-days-calculator': return <WorkingDays />
    case 'date-time-calculator': return <DateTimeCalculator />
    default: return null
  }
}

function WorldClock() {
  const t = usePhrase()
  const zoneNames = useTimeZones()
  const [settings, setSettings] = useVersionedStore(
    worldClockKey,
    1,
    defaultWorldClockSettings,
    isWorldClockSettings,
  )
  const [search, setSearch] = useState('')
  const [localZone, setLocalZone] = useState('UTC')
  const [now, setNow] = useState(0)
  const cities = [...new Set([localZone, ...settings.value.zones])]
    .sort((a, b) => Number(settings.value.favorites.includes(b)) - Number(settings.value.favorites.includes(a)))
  useEffect(() => {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    const initialize = window.setTimeout(() => {
      setLocalZone(isValidTimeZone(detected) ? detected : 'UTC')
      setNow(Date.now())
    }, 0)
    const timer = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => {
      window.clearTimeout(initialize)
      window.clearInterval(timer)
    }
  }, [])
  const filteredZones = useMemo(() => zoneNames.filter((zone) =>
    zone.toLowerCase().includes(search.trim().toLowerCase()),
  ).slice(0, 80), [search, zoneNames])
  const addZone = () => {
    if (filteredZones[0] && !cities.includes(filteredZones[0])) {
      setSettings((current) => ({ ...current, zones: [...current.zones, filteredZones[0]] }))
      trackProductEvent('tool_use', { tool_id: 'world-clock', tool_category: 'meetings' })
    }
    setSearch('')
  }
  const removeZone = (zone: string) => {
    setSettings((current) => ({ ...current, zones: current.zones.filter((item) => item !== zone) }))
  }
  const toggleFavorite = (zone: string) => {
    setSettings((current) => ({
      ...current,
      favorites: current.favorites.includes(zone)
        ? current.favorites.filter((item) => item !== zone)
        : [...current.favorites, zone],
    }))
  }
  return (
    <div className="grid gap-5">
      <Section title={t('World clock')}>
        <p className="mt-1 text-sm text-slate-600">{t('Live local times use each location’s IANA time zone, including daylight-saving changes.')}</p>
        {settings.status !== 'ready' && (
          <p className="mt-3 text-sm text-amber-800" role="status">
            {settings.error ?? t('Loading saved world clock preferences…')} {t('Changes are disabled until preferences are available.')}
          </p>
        )}
        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
          <Field label={t('Search IANA time zones')}>
            <input className={inputClass} value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('Try Tokyo or America/…')} list="meeting-time-zones" />
            <datalist id="meeting-time-zones">{filteredZones.map((zone) => <option key={zone} value={zone} />)}</datalist>
          </Field>
          <button className={`${buttonClass} self-end`} type="button" onClick={addZone} disabled={settings.status !== 'ready' || !search.trim() || !filteredZones.length}>{t('Add location')}</button>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {cities.map((zone) => (
            <article key={zone} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{zoneLabel(zone)} {zone === localZone && <span className="text-xs font-medium text-indigo-700">{t('(your local time)')}</span>}</h3>
                  <p className="mt-1 text-2xl font-semibold tabular-nums">{now ? new Intl.DateTimeFormat(undefined, { timeZone: zone, hour: '2-digit', minute: '2-digit', hourCycle: settings.value.hour12 ? 'h12' : 'h23' }).format(now) : '—:—'}</p>
                  <p className="text-sm text-slate-600">{now ? new Intl.DateTimeFormat(undefined, { timeZone: zone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(now) : t('Loading local date')}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <button
                    className="text-lg text-amber-600 hover:text-amber-700"
                    type="button"
                    disabled={settings.status !== 'ready'}
                    onClick={() => toggleFavorite(zone)}
                    aria-label={`${settings.value.favorites.includes(zone) ? t('Unfavorite') : t('Favorite')} ${zone}`}
                    aria-pressed={settings.value.favorites.includes(zone)}
                    title={settings.value.favorites.includes(zone) ? t('Remove favorite') : t('Add favorite')}
                  >{settings.value.favorites.includes(zone) ? '★' : '☆'}</button>
                  {zone !== localZone && <button className="text-sm text-slate-500 underline hover:text-red-700" type="button" disabled={settings.status !== 'ready'} onClick={() => removeZone(zone)} aria-label={`${t('Remove')} ${zone}`}>{t('Remove')}</button>}
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-2 text-sm">
          <span className="font-medium">{t('Time format')}</span>
          <button type="button" className={secondaryButtonClass} disabled={settings.status !== 'ready'} onClick={() => setSettings((current) => ({ ...current, hour12: !current.hour12 }))}>{t(settings.value.hour12 ? '12-hour' : '24-hour')}</button>
        </div>
      </Section>
    </div>
  )
}

function TimeZoneConverter() {
  const t = usePhrase()
  const [sourceZone, setSourceZone] = useState('UTC')
  const [sourceLocal, setSourceLocal] = useState('')
  const [targetZone, setTargetZone] = useState('America/New_York')
  const [extraZones, setExtraZones] = useState<string[]>(['Europe/London'])
  const [resolutionChoice, setResolutionChoice] = useState('')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState<number | null>(null)
  useEffect(() => {
    const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    const initialize = window.setTimeout(() => {
      setSourceZone(localZone)
      setSourceLocal(localDateTimeInput())
    }, 0)
    return () => window.clearTimeout(initialize)
  }, [])
  const resolution = sourceLocal ? resolveLocalDateTime(sourceLocal, sourceZone) : null
  const convert = () => {
    trackProductEvent('tool_use', { tool_id: 'time-zone-converter', tool_category: 'meetings' })
    if (!sourceLocal) {
      setMessage(t('Choose a local date and time first.'))
      return
    }
    const next = resolveLocalDateTime(sourceLocal, sourceZone)
    if (next.kind === 'invalid') {
      setMessage(t('That date, time, or IANA time zone is invalid.'))
      setResult(null)
    } else if (next.kind === 'nonexistent') {
      setMessage(t('This local time does not exist because the clock moves forward for daylight saving. Choose another time; it has not been silently adjusted.'))
      setResult(null)
    } else if (next.kind === 'ambiguous' && !resolutionChoice) {
      setMessage(t('This local time occurs twice when clocks move back. Choose the earlier or later occurrence below.'))
      setResult(null)
    } else {
      const selected = next.kind === 'ambiguous' ? Number(resolutionChoice) : next.instants[0]
      setResult(selected)
      setMessage(next.kind === 'ambiguous' ? t(selected === next.instants[0] ? 'Using the earlier occurrence.' : 'Using the later occurrence.') : '')
      trackProductEvent('tool_complete', { tool_id: 'time-zone-converter', tool_category: 'meetings' })
    }
  }
  return (
    <div className="grid gap-5">
      <Section title={t('Convert a local date and time')}>
        <p className="mt-1 text-sm text-slate-600">{t('Conversions use IANA time-zone rules. DST gaps are rejected; repeated fall-back times require an explicit choice.')}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <TimeZoneSelect label="From time zone" value={sourceZone} onChange={(zone) => { setSourceZone(zone); setResult(null); setResolutionChoice('') }} />
          <Field label={t('Local date and time')}><input className={inputClass} type="datetime-local" value={sourceLocal} onChange={(event) => { setSourceLocal(event.target.value); setResult(null); setResolutionChoice('') }} /></Field>
        </div>
        {resolution?.kind === 'ambiguous' && (
          <fieldset className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm">
            <legend className="font-semibold">{t('This time occurs twice')}</legend>
            {resolution.instants.map((instant, index) => (
              <label key={instant} className="mt-2 flex items-center gap-2">
                <input type="radio" name="dst-occurrence" checked={resolutionChoice === String(instant)} onChange={() => setResolutionChoice(String(instant))} />
                {t(index === 0 ? 'Earlier occurrence' : 'Later occurrence')} — {new Date(instant).toISOString()}
              </label>
            ))}
          </fieldset>
        )}
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <TimeZoneSelect label="Compare with" value={targetZone} onChange={setTargetZone} />
          <button type="button" className={buttonClass} onClick={convert}>{t('Convert')}</button>
          <button type="button" className={secondaryButtonClass} onClick={() => setExtraZones((zones) => zones.length < 5 ? [...zones, 'Asia/Tokyo'] : zones)} disabled={extraZones.length >= 5}>{t('Add comparison zone')}</button>
        </div>
        {extraZones.map((zone, index) => (
          <div className="mt-3 flex flex-wrap items-end gap-3" key={`${index}-${zone}`}>
            <TimeZoneSelect label={`${t('Additional comparison')} ${index + 1}`} value={zone} onChange={(next) => setExtraZones((zones) => zones.map((item, i) => i === index ? next : item))} />
            <button type="button" className={secondaryButtonClass} onClick={() => setExtraZones((zones) => zones.filter((_, i) => i !== index))}>{t('Remove')}</button>
          </div>
        ))}
        <p className="mt-3 text-sm text-amber-800" role="status">{message}</p>
        {result !== null && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[targetZone, ...extraZones].map((zone, index) => (
              <div key={`${zone}-${index}`} className="rounded-xl bg-indigo-50 p-4">
                <p className="text-sm font-semibold text-indigo-950">{zoneLabel(zone)}</p>
                <p className="mt-1 font-medium">{formatZonedDateTime(result, zone)}</p>
                <p className="text-sm text-slate-600">{getTimezoneOffsetLabel(result, zone)} · {zone === sourceZone ? 'same time zone' : formatZonedDateTime(result, sourceZone)}</p>
              </div>
            ))}
            <div className="rounded-xl bg-slate-100 p-4 text-sm">
              <p className="font-semibold">{t('UTC reference')}</p>
              <p className="mt-1">{new Date(result).toISOString()}</p>
              <p className="text-slate-600">{t('Day differences are shown in each formatted local date.')}</p>
            </div>
          </div>
        )}
      </Section>
    </div>
  )
}

function MeetingPlanner() {
  const t = usePhrase()
  const [participants, setParticipants] = useState(defaultParticipants)
  const [duration, setDuration] = useState(30)
  const [fromDate, setFromDate] = useState('')
  const [searched, setSearched] = useState(false)
  useEffect(() => {
    const initialize = window.setTimeout(() => setFromDate(localDateInput()), 0)
    return () => window.clearTimeout(initialize)
  }, [])
  const candidates = useMemo(() => searched ? findMeetingCandidates(participants, duration, fromDate).slice(0, 12) : [], [duration, fromDate, participants, searched])
  const updateParticipant = (id: string, patch: Partial<PlannerParticipant>) =>
    setParticipants((current) => current.map((person) => person.id === id ? { ...person, ...patch } : person))
  const addParticipant = () => setParticipants((current) => [...current, {
    id: `participant-${Date.now()}`, name: `Participant ${current.length + 1}`, timeZone: 'Asia/Tokyo', startHour: 9, endHour: 17,
  }])
  return (
    <div className="grid gap-5">
      <Section title={t('Compare participant availability')}>
        <p className="mt-1 text-sm text-slate-600">{t('Candidates start on 15-minute boundaries, fall on each participant’s weekday, and fit wholly inside every participant’s selected local hours.')}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label={t('Search starting date')}><input className={inputClass} type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} /></Field>
          <Field label={t('Meeting duration')}>
            <select className={inputClass} value={duration} onChange={(event) => setDuration(Number(event.target.value))}>
              {[15, 30, 45, 60, 90, 120].map((minutes) => <option key={minutes} value={minutes}>{minutes} minutes</option>)}
            </select>
          </Field>
        </div>
        <div className="mt-5 grid gap-4">
          {participants.map((person) => (
            <article key={person.id} className="rounded-xl border border-slate-200 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label={t('Participant name')}><input className={inputClass} value={person.id === 'you' && person.name === 'You' ? t('You') : person.name} onChange={(event) => updateParticipant(person.id, { name: event.target.value })} /></Field>
                <TimeZoneSelect value={person.timeZone} onChange={(timeZone) => updateParticipant(person.id, { timeZone })} />
                <Field label={t('Working day starts (hour)')}><input className={inputClass} type="number" min="0" max="23" value={person.startHour} onChange={(event) => updateParticipant(person.id, { startHour: Math.min(23, Math.max(0, Number(event.target.value))) })} /></Field>
                <Field label={t('Working day ends (hour)')}><input className={inputClass} type="number" min="1" max="24" value={person.endHour} onChange={(event) => updateParticipant(person.id, { endHour: Math.min(24, Math.max(1, Number(event.target.value))) })} /></Field>
              </div>
              {participants.length > 1 && <button className="mt-3 text-sm text-slate-500 underline" type="button" onClick={() => setParticipants((current) => current.filter((item) => item.id !== person.id))}>{t('Remove participant')}</button>}
            </article>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" className={secondaryButtonClass} onClick={addParticipant} disabled={participants.length >= 8}>{t('Add participant')}</button>
          <button type="button" className={buttonClass} onClick={() => {
            trackProductEvent('tool_use', { tool_id: 'meeting-planner', tool_category: 'meetings' })
            setSearched(true)
            trackProductEvent('tool_complete', { tool_id: 'meeting-planner', tool_category: 'meetings' })
          }} disabled={!fromDate || participants.some((person) => person.startHour >= person.endHour)}>{t('Find candidates')}</button>
        </div>
        <p className="mt-4 rounded-lg bg-slate-100 p-3 text-sm text-slate-600">{t('Criteria: weekdays are Monday–Friday for everyone; every candidate must fit within all configured local working-hour windows. Search covers 14 days. Results are candidates that meet these rules—not a ranking or a claim that any time is “best.”')}</p>
        {searched && (
          <div className="mt-4">
            {candidates.length ? <div className="grid gap-3">{candidates.map((candidate) => (
              <article key={candidate} className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                <p className="font-semibold">UTC · {new Date(candidate).toISOString().replace('T', ' ').slice(0, 16)}</p>
                <ul className="mt-2 grid gap-1 text-sm text-slate-700 sm:grid-cols-2">
                  {participants.map((person) => <li key={person.id}>{person.name}: {formatZonedTime(candidate, person.timeZone)} – {formatZonedTime(candidate + duration * 60_000, person.timeZone)}</li>)}
                </ul>
              </article>
            ))}</div> : <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{t('No matching times were found in the next 14 days. Try longer working-hour windows or a shorter duration.')}</p>}
          </div>
        )}
      </Section>
    </div>
  )
}

type CountdownEntry = {
  id: string
  title: string
  durationMs: number
  targetAt: number | null
  remainingMs: number
}
const countdownKey = 'workingnow.meeting-countdowns'
const countdownDefaults: CountdownEntry[] = []

function MeetingCountdown() {
  const t = usePhrase()
  const [snapshot, setTimers] = useVersionedStore(countdownKey, 1, countdownDefaults)
  const [now, setNow] = useState(0)
  const [title, setTitle] = useState('')
  const [when, setWhen] = useState('')
  const [error, setError] = useState('')
  useEffect(() => {
    const initialize = window.setTimeout(() => setNow(Date.now()), 0)
    const interval = window.setInterval(() => setNow(Date.now()), 1000)
    return () => {
      window.clearTimeout(initialize)
      window.clearInterval(interval)
    }
  }, [])
  const update = (id: string, patch: Partial<CountdownEntry>) =>
    setTimers((current) => current.map((timer) => timer.id === id ? { ...timer, ...patch } : timer))
  const addTimer = () => {
    trackProductEvent('tool_use', { tool_id: 'meeting-countdown', tool_category: 'meetings' })
    const timestamp = new Date(when).getTime()
    if (!title.trim() || !when || !Number.isFinite(timestamp)) {
      setError(t('Add a title and a valid meeting date and time.'))
      return
    }
    const durationMs = Math.max(0, timestamp - Date.now())
    const result = setTimers((current) => [...current, {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: title.trim(),
      durationMs,
      targetAt: timestamp,
      remainingMs: durationMs,
    }])
    if (!result.ok) setError(result.error)
    else {
      setTitle('')
      setWhen('')
      setError('')
    }
  }
  const formatRemaining = (value: number) => {
    const total = Math.max(0, Math.ceil(value / 1000))
    const days = Math.floor(total / 86_400)
    const hours = Math.floor((total % 86_400) / 3600)
    const minutes = Math.floor((total % 3600) / 60)
    const seconds = total % 60
    return `${days ? `${days}d ` : ''}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
  return (
    <div className="grid gap-5">
      <Section title={t('Upcoming meetings')}>
        <p className="mt-1 text-sm text-slate-600">{t('Countdowns are stored in this browser only. The meeting time uses your device’s local time zone.')}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <Field label={t('Meeting name')}><input className={inputClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder={t('Project check-in')} /></Field>
          <Field label={t('Meeting date and time')}><input className={inputClass} type="datetime-local" value={when} onChange={(event) => setWhen(event.target.value)} /></Field>
          <button className={`${buttonClass} self-end`} type="button" onClick={addTimer} disabled={snapshot.status !== 'ready'}>{t('Add countdown')}</button>
        </div>
        {snapshot.status !== 'ready' && <p className="mt-3 text-sm text-amber-800">{snapshot.error ?? t('Loading saved countdowns…')} {t('Saving is disabled until existing data can be read safely.')}</p>}
        {error && <p className="mt-3 text-sm text-red-700" role="alert">{error}</p>}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {snapshot.value.map((timer) => {
            const remaining = timer.targetAt === null || !now ? timer.remainingMs : Math.max(0, timer.targetAt - now)
            const finished = timer.targetAt !== null && timer.targetAt <= now
            return (
              <article key={timer.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex justify-between gap-3">
                  <div><h3 className="font-semibold">{timer.title}</h3><p className="mt-1 text-2xl font-bold tabular-nums">{formatRemaining(remaining)}</p></div>
                  <button className="text-sm text-slate-500 underline" type="button" onClick={() => setTimers((current) => current.filter((item) => item.id !== timer.id))}>{t('Remove')}</button>
                </div>
                <p className="mt-1 text-sm text-slate-600">{finished ? t('Meeting time reached') : timer.targetAt === null ? t('Paused') : `${t('Starts')} ${new Date(timer.targetAt).toLocaleString()}`}</p>
                <div className="mt-3 flex gap-2">
                  {!finished && (timer.targetAt !== null
                    ? <button className={secondaryButtonClass} type="button" onClick={() => update(timer.id, { targetAt: null, remainingMs: remaining })}>{t('Pause')}</button>
                    : <button className={secondaryButtonClass} type="button" onClick={() => update(timer.id, { targetAt: Date.now() + timer.remainingMs })}>{t('Resume')}</button>)}
                  <button className={secondaryButtonClass} type="button" onClick={() => update(timer.id, { targetAt: Date.now() + timer.durationMs, remainingMs: timer.durationMs })}>{t('Reset')}</button>
                </div>
              </article>
            )
          })}
          {snapshot.status === 'ready' && !snapshot.value.length && <p className="text-sm text-slate-500">{t('No countdowns yet.')}</p>}
        </div>
      </Section>
    </div>
  )
}

type AgendaPhase = { name: string; minutes: number }
const initialPhases: AgendaPhase[] = [
  { name: 'Opening', minutes: 5 },
  { name: 'Discussion', minutes: 20 },
  { name: 'Actions and close', minutes: 5 },
]

function MeetingTimer() {
  const t = usePhrase()
  const [phases, setPhases] = useState(initialPhases)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [seconds, setSeconds] = useState(30 * 60)
  const [deadline, setDeadline] = useState<number | null>(null)
  const [now, setNow] = useState(0)
  const [ended, setEnded] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  useEffect(() => {
    if (deadline === null) return
    const tick = () => {
      const current = Date.now()
      setNow(current)
      const remaining = Math.max(0, Math.ceil((deadline - current) / 1000))
      setSeconds(remaining)
      if (remaining === 0) {
        setDeadline(null)
        setEnded(true)
      }
    }
    tick()
    const interval = window.setInterval(tick, 250)
    return () => window.clearInterval(interval)
  }, [deadline])
  const formatted = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
  const start = () => {
    trackProductEvent('tool_use', { tool_id: 'meeting-timer', tool_category: 'meetings' })
    if (seconds <= 0) return
    setEnded(false)
    setHasStarted(true)
    setDeadline(Date.now() + seconds * 1000)
    setNow(Date.now())
  }
  const reset = () => {
    setDeadline(null)
    setEnded(false)
    setHasStarted(false)
    setSeconds((phases[phaseIndex]?.minutes ?? 30) * 60)
  }
  const choosePreset = (minutes: number) => {
    setDeadline(null)
    setEnded(false)
    setHasStarted(false)
    setSeconds(minutes * 60)
  }
  const selectPhase = (index: number) => {
    setDeadline(null)
    setEnded(false)
    setHasStarted(false)
    setPhaseIndex(index)
    setSeconds(phases[index].minutes * 60)
  }
  const nextPhase = () => selectPhase((phaseIndex + 1) % phases.length)
  const updatePhase = (index: number, patch: Partial<AgendaPhase>) =>
    setPhases((current) => current.map((phase, i) => i === index ? { ...phase, ...patch } : phase))
  return (
    <div className="grid gap-5">
      <Section title={t('Meeting timer')}>
        <p className="mt-1 text-sm text-slate-600">{t('The countdown runs locally in this tab. The end status changes when the selected duration reaches zero.')}</p>
        <div className="mt-5 rounded-2xl bg-slate-950 px-5 py-8 text-center text-white">
          <p className="text-sm text-slate-300">{t(phases[phaseIndex]?.name ?? 'Meeting timer')}</p>
          <p className="my-3 text-6xl font-bold tabular-nums" aria-live="polite">{formatted}</p>
          <p className="font-medium" role="status">{ended ? t('Time is up') : deadline ? `${t('Running')}${now ? ` · ${t('ends')} ${new Date(deadline).toLocaleTimeString()}` : ''}` : hasStarted ? t('Paused') : t('Ready')}</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {([[15, '15 min'], [30, '30 min'], [45, '45 min'], [60, '60 min']] as const).map(([minutes, label]) => <button key={minutes} type="button" className={secondaryButtonClass} onClick={() => choosePreset(minutes)}>{t(label)}</button>)}
          {deadline === null ? <button type="button" className={buttonClass} onClick={start} disabled={seconds <= 0}>{t('Start')}</button> : <button type="button" className={secondaryButtonClass} onClick={() => setDeadline(null)}>{t('Pause')}</button>}
          <button type="button" className={secondaryButtonClass} onClick={reset}>{t('Reset')}</button>
        </div>
        <div className="mt-6 border-t border-slate-200 pt-5">
          <h3 className="font-semibold">{t('Agenda phases')}</h3>
          <p className="mt-1 text-sm text-slate-600">{t('Select a phase to load its duration. Advance manually when the group is ready.')}</p>
          <div className="mt-3 grid gap-3">
            {phases.map((phase, index) => (
              <div key={index} className={`grid items-end gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_130px_auto] ${phaseIndex === index ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200'}`}>
                <Field label={`${t('Phase')} ${index + 1}`}><input className={inputClass} value={t(phase.name)} onChange={(event) => updatePhase(index, { name: event.target.value })} /></Field>
                <Field label={t('Minutes')}><input className={inputClass} type="number" min="1" max="240" value={phase.minutes} onChange={(event) => updatePhase(index, { minutes: Math.max(1, Number(event.target.value)) })} /></Field>
                <button className={secondaryButtonClass} type="button" onClick={() => selectPhase(index)}>{t('Use phase')}</button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <button type="button" className={secondaryButtonClass} onClick={() => setPhases((current) => [...current, { name: `Phase ${current.length + 1}`, minutes: 5 }])} disabled={phases.length >= 8}>{t('Add phase')}</button>
            {phases.length > 1 && <button type="button" className={secondaryButtonClass} onClick={nextPhase}>{t('Next phase')}</button>}
          </div>
        </div>
      </Section>
    </div>
  )
}

function WorkingDays() {
  const t = usePhrase()
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [weekdays, setWeekdays] = useState([1, 2, 3, 4, 5])
  const [holidaysText, setHolidaysText] = useState('')
  const [includeEnd, setIncludeEnd] = useState(true)
  useEffect(() => {
    const initialize = window.setTimeout(() => {
      const now = new Date()
      setStart(localDateInput(new Date(now.getFullYear(), now.getMonth(), 1)))
      setEnd(localDateInput(new Date(now.getFullYear(), now.getMonth() + 1, 0)))
    }, 0)
    return () => window.clearTimeout(initialize)
  }, [])
  const holidays = holidaysText.split(/[\s,]+/).filter((value) => /^\d{4}-\d{2}-\d{2}$/.test(value))
  const result = start && end ? calculateWorkingDays(start, end, weekdays, holidays, includeEnd) : null
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return (
    <div className="grid gap-5" onChange={() => {
      trackProductEvent('tool_use', { tool_id: 'working-days-calculator', tool_category: 'meetings' })
      trackProductEvent('tool_complete', { tool_id: 'working-days-calculator', tool_category: 'meetings' })
    }}>
      <Section title={t('Count working days')}>
        <p className="mt-1 text-sm text-slate-600">{t('Choose a date range, workweek, and optional holiday dates. This calculator does not infer public holidays.')}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label={t('Start date')}><input className={inputClass} type="date" value={start} onChange={(event) => setStart(event.target.value)} /></Field>
          <Field label={t('End date')}><input className={inputClass} type="date" value={end} onChange={(event) => setEnd(event.target.value)} /></Field>
        </div>
        <fieldset className="mt-4">
          <legend className="text-sm font-medium text-slate-700">{t('Working weekdays')}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {labels.map((label, day) => (
              <label key={label} className={`cursor-pointer rounded-lg border px-3 py-2 text-sm ${weekdays.includes(day) ? 'border-indigo-300 bg-indigo-50 text-indigo-900' : 'border-slate-300'}`}>
                <input className="sr-only" type="checkbox" checked={weekdays.includes(day)} onChange={() => setWeekdays((current) => current.includes(day) ? current.filter((item) => item !== day) : [...current, day])} />{label}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label={t('Holiday dates (YYYY-MM-DD, comma or line separated)')}>
            <textarea className={`${inputClass} min-h-24`} value={holidaysText} onChange={(event) => setHolidaysText(event.target.value)} placeholder="2026-12-25, 2026-12-28" />
          </Field>
          <label className="flex items-start gap-2 pt-6 text-sm text-slate-700"><input className="mt-1" type="checkbox" checked={includeEnd} onChange={(event) => setIncludeEnd(event.target.checked)} />{t('Include the end date in the range')}</label>
        </div>
        <div className="mt-5 rounded-xl bg-indigo-50 p-5">
          {result ? result.error ? <p className="font-medium text-red-700">{t(result.error)}</p> : <><p className="text-sm font-medium text-indigo-900">{t('Working days, based on the selected rules')}</p><p className="mt-1 text-4xl font-bold text-indigo-950">{result.count}</p></> : <p className="text-sm text-slate-600">{t('Preparing the current month’s date range…')}</p>}
        </div>
        <p className="mt-3 text-sm text-slate-600">{t('Rules: dates are counted by calendar day and include both endpoints by default. Selected weekdays count once unless explicitly listed as a holiday. No country-specific holiday calendar is applied.')}</p>
      </Section>
    </div>
  )
}

function DateTimeCalculator() {
  const t = usePhrase()
  const [date, setDate] = useState('')
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [result, setResult] = useState<number | null>(null)
  useEffect(() => {
    const initialize = window.setTimeout(() => setDate(localDateTimeInput()), 0)
    return () => window.clearTimeout(initialize)
  }, [])
  const calculate = () => {
    const timestamp = new Date(date).getTime()
    if (!date || !Number.isFinite(timestamp) || days < 0 || hours < 0 || minutes < 0) {
      setResult(null)
      return
    }
    setResult(addElapsedTime(timestamp, days, hours, minutes, direction))
  }
  return (
    <div className="grid gap-5">
      <Section title={t('Add or subtract elapsed time')}>
        <p className="mt-1 text-sm text-slate-600">{t('Set a starting local date and time and an amount to add or subtract.')}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label={t('Starting local date and time')}><input className={inputClass} type="datetime-local" value={date} onChange={(event) => setDate(event.target.value)} /></Field>
          <Field label={t('Direction')}><select className={inputClass} value={direction} onChange={(event) => setDirection(Number(event.target.value) as 1 | -1)}><option value="1">{t('Add')}</option><option value="-1">{t('Subtract')}</option></select></Field>
          <Field label={t('Days')}><input className={inputClass} type="number" min="0" value={days} onChange={(event) => setDays(Number(event.target.value))} /></Field>
          <Field label={t('Hours')}><input className={inputClass} type="number" min="0" value={hours} onChange={(event) => setHours(Number(event.target.value))} /></Field>
          <Field label={t('Minutes')}><input className={inputClass} type="number" min="0" value={minutes} onChange={(event) => setMinutes(Number(event.target.value))} /></Field>
        </div>
        <button type="button" className={`${buttonClass} mt-4`} onClick={() => {
          trackProductEvent('tool_use', { tool_id: 'date-time-calculator', tool_category: 'meetings' })
          calculate()
          trackProductEvent('tool_complete', { tool_id: 'date-time-calculator', tool_category: 'meetings' })
        }}>{t('Calculate')}</button>
        {result !== null && <div className="mt-5 rounded-xl bg-indigo-50 p-5"><p className="text-sm font-medium text-indigo-900">{t('Result in your device’s local time zone')}</p><p className="mt-1 text-xl font-bold">{new Date(result).toLocaleString()}</p><p className="mt-1 text-sm text-slate-600">{t('UTC reference')}: {new Date(result).toISOString()}</p></div>}
        <p className="mt-3 text-sm text-slate-600">{t('Rule: “days” means 24 elapsed hours, not the next local calendar date. All entered units are combined into elapsed minutes before calculation, so the result remains unambiguous across daylight-saving transitions.')}</p>
      </Section>
    </div>
  )
}
