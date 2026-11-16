import assert from 'node:assert/strict'
import test from 'node:test'
import {
  addElapsedTime,
  calculateWorkingDays,
  findMeetingCandidates,
  getWallDateTime,
  resolveLocalDateTime,
} from './calculations.ts'

test('local time resolution identifies DST gaps and repeated clock times', () => {
  assert.equal(resolveLocalDateTime('2026-03-08T02:30', 'America/New_York').kind, 'nonexistent')
  const repeated = resolveLocalDateTime('2026-11-01T01:30', 'America/New_York')
  assert.equal(repeated.kind, 'ambiguous')
  assert.equal(repeated.instants.length, 2)
  assert.equal(repeated.instants[1] - repeated.instants[0], 60 * 60 * 1000)
  assert.equal(resolveLocalDateTime('2026-02-30T12:00', 'UTC').kind, 'invalid')
})

test('resolved instants format to the requested local wall time', () => {
  const resolved = resolveLocalDateTime('2026-07-01T09:15', 'America/Los_Angeles')
  assert.equal(resolved.kind, 'valid')
  assert.deepEqual(getWallDateTime(resolved.instants[0], 'America/Los_Angeles'), {
    year: 2026, month: 7, day: 1, hour: 9, minute: 15,
  })
})

test('working-day counts honor custom weekdays, holidays, and inclusive end dates', () => {
  const weekdays = [1, 2, 3, 4, 5]
  assert.equal(calculateWorkingDays('2026-01-05', '2026-01-09', weekdays, []).count, 5)
  assert.equal(calculateWorkingDays('2026-01-05', '2026-01-09', weekdays, ['2026-01-07']).count, 4)
  assert.equal(calculateWorkingDays('2026-01-05', '2026-01-09', weekdays, [], false).count, 4)
  assert.equal(calculateWorkingDays('2026-01-03', '2026-01-04', [0, 6], []).count, 2)
  assert.ok(calculateWorkingDays('2026-01-10', '2026-01-09', weekdays, []).error)
})

test('elapsed-time arithmetic is deterministic and supports subtraction', () => {
  const start = Date.UTC(2026, 0, 1, 12)
  assert.equal(addElapsedTime(start, 1, 2, 30, 1), start + 26.5 * 60 * 60 * 1000)
  assert.equal(addElapsedTime(start, 0, 2, 0, -1), start - 2 * 60 * 60 * 1000)
})

test('meeting candidates satisfy each participant work window', () => {
  const participants = [
    { id: 'a', name: 'A', timeZone: 'UTC', startHour: 9, endHour: 17 },
    { id: 'b', name: 'B', timeZone: 'Europe/London', startHour: 9, endHour: 17 },
  ]
  const candidates = findMeetingCandidates(participants, 60, '2026-01-05', 1)
  assert.ok(candidates.length > 0)
  for (const timestamp of candidates) {
    for (const participant of participants) {
      const local = getWallDateTime(timestamp, participant.timeZone)
      assert.ok(local.hour >= participant.startHour)
      assert.ok(local.hour * 60 + local.minute + 60 <= participant.endHour * 60)
    }
  }
})
