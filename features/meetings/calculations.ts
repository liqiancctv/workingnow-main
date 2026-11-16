export type WallDateTime = {
  year: number
  month: number
  day: number
  hour: number
  minute: number
}

export type PlannerParticipant = {
  id: string
  name: string
  timeZone: string
  startHour: number
  endHour: number
}

export type LocalTimeResolution =
  | { kind: 'valid'; instants: number[] }
  | { kind: 'ambiguous'; instants: number[] }
  | { kind: 'nonexistent'; instants: [] }
  | { kind: 'invalid'; instants: [] }

const wallFormatterCache = new Map<string, Intl.DateTimeFormat>()

function wallFormatter(timeZone: string) {
  let formatter = wallFormatterCache.get(timeZone)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    })
    wallFormatterCache.set(timeZone, formatter)
  }
  return formatter
}

export function isValidTimeZone(timeZone: string) {
  try {
    wallFormatter(timeZone)
    return true
  } catch {
    return false
  }
}

export function getWallDateTime(timestamp: number, timeZone: string): WallDateTime {
  const parts = wallFormatter(timeZone).formatToParts(new Date(timestamp))
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]))
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
  }
}

function sameWallTime(a: WallDateTime, b: WallDateTime) {
  return a.year === b.year && a.month === b.month && a.day === b.day &&
    a.hour === b.hour && a.minute === b.minute
}

function offsetAt(timestamp: number, timeZone: string) {
  const date = new Date(timestamp)
  const parts = wallFormatter(timeZone).formatToParts(date)
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]))
  const representedAsUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  )
  return representedAsUtc - Math.floor(timestamp / 1000) * 1000
}

export function resolveLocalDateTime(value: string, timeZone: string): LocalTimeResolution {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value)
  if (!match || !isValidTimeZone(timeZone)) return { kind: 'invalid', instants: [] }
  const wall: WallDateTime = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4]),
    minute: Number(match[5]),
  }
  const nominal = Date.UTC(wall.year, wall.month - 1, wall.day, wall.hour, wall.minute)
  const checkDate = new Date(nominal)
  if (
    checkDate.getUTCFullYear() !== wall.year ||
    checkDate.getUTCMonth() !== wall.month - 1 ||
    checkDate.getUTCDate() !== wall.day ||
    wall.hour > 23 ||
    wall.minute > 59
  ) return { kind: 'invalid', instants: [] }

  const offsets = new Set<number>()
  for (let hours = -48; hours <= 48; hours += 3) {
    offsets.add(offsetAt(nominal + hours * 3_600_000, timeZone))
  }
  const instants = [...offsets]
    .map((offset) => nominal - offset)
    .filter((timestamp) => sameWallTime(getWallDateTime(timestamp, timeZone), wall))
    .sort((a, b) => a - b)
  if (instants.length === 0) return { kind: 'nonexistent', instants: [] }
  if (instants.length > 1) return { kind: 'ambiguous', instants }
  return { kind: 'valid', instants }
}

export function formatZonedDateTime(timestamp: number, timeZone: string, hour12 = false) {
  return new Intl.DateTimeFormat(undefined, {
    timeZone,
    dateStyle: 'medium',
    timeStyle: 'short',
    hour12,
  }).format(new Date(timestamp))
}

export function formatZonedTime(timestamp: number, timeZone: string, hour12 = false) {
  return new Intl.DateTimeFormat(undefined, {
    timeZone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12,
    timeZoneName: 'short',
  }).format(new Date(timestamp))
}

export function calculateWorkingDays(
  start: string,
  end: string,
  workingWeekdays: number[],
  holidays: string[],
  includeEnd = true,
) {
  const startDate = new Date(`${start}T00:00:00Z`)
  const endDate = new Date(`${end}T00:00:00Z`)
  if (Number.isNaN(startDate.valueOf()) || Number.isNaN(endDate.valueOf())) {
    return { count: 0, error: 'Enter valid start and end dates.' }
  }
  if (startDate > endDate) return { count: 0, error: 'Start date must be on or before end date.' }
  const holidaySet = new Set(holidays)
  let count = 0
  for (let day = startDate.valueOf(); day <= endDate.valueOf(); day += 86_400_000) {
    const date = new Date(day)
    const key = date.toISOString().slice(0, 10)
    const isEndExcluded = !includeEnd && day === endDate.valueOf()
    if (!isEndExcluded && workingWeekdays.includes(date.getUTCDay()) && !holidaySet.has(key)) count += 1
  }
  return { count, error: '' }
}

export function addElapsedTime(timestamp: number, days: number, hours: number, minutes: number, direction: 1 | -1) {
  return timestamp + direction * ((days * 24 + hours) * 60 + minutes) * 60_000
}

export function getTimezoneOffsetLabel(timestamp: number, timeZone: string) {
  const minutes = offsetAt(timestamp, timeZone) / 60_000
  const sign = minutes < 0 ? '−' : '+'
  const absolute = Math.abs(minutes)
  return `UTC${sign}${String(Math.floor(absolute / 60)).padStart(2, '0')}:${String(absolute % 60).padStart(2, '0')}`
}

export function findMeetingCandidates(
  participants: PlannerParticipant[],
  durationMinutes: number,
  fromDate: string,
  daysToSearch = 14,
) {
  if (!participants.length || participants.some((person) => !isValidTimeZone(person.timeZone))) return []
  const firstDay = new Date(`${fromDate}T00:00:00Z`)
  if (Number.isNaN(firstDay.valueOf()) || durationMinutes < 1) return []
  const results: number[] = []
  const start = firstDay.valueOf()
  const end = start + daysToSearch * 86_400_000
  for (let timestamp = start; timestamp < end; timestamp += 15 * 60_000) {
    const matches = participants.every((person) => {
      const local = getWallDateTime(timestamp, person.timeZone)
      const localDate = new Date(Date.UTC(local.year, local.month - 1, local.day))
      const minuteOfDay = local.hour * 60 + local.minute
      return localDate.getUTCDay() >= 1 && localDate.getUTCDay() <= 5 &&
        minuteOfDay >= person.startHour * 60 &&
        minuteOfDay + durationMinutes <= person.endHour * 60
    })
    if (matches) results.push(timestamp)
  }
  return results
}
