'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useVersionedStore } from '@/lib/storage/versioned-store'
import { trackProductEvent } from '@/lib/analytics/events'
import { useProductLocale } from '@/components/product/product-i18n-provider'
import { translateProductPhrase } from '@/lib/product-i18n'
import { addTile, canMove2048, move2048, newMineBoard, newSudoku, revealMine, validSudoku, MINE_COUNT, MINE_SIZE, type BreakSlug, type Direction, type MineCell } from './logic'

type Status = 'idle' | 'running' | 'paused' | 'finished'
type Result = { date: string; score: number; seconds: number; outcome: string }
type History = { results: Result[]; bestScore: number; bestTime: number | null; completions: number }
const emptyHistory: History = { results: [], bestScore: 0, bestTime: null, completions: 0 }
function isHistory(value: unknown): value is History {
  if (typeof value !== 'object' || value === null || !('results' in value) || !Array.isArray(value.results)) return false
  if (!('bestScore' in value) || typeof value.bestScore !== 'number' || !Number.isFinite(value.bestScore) || value.bestScore < 0 ||
      !('bestTime' in value) || (value.bestTime !== null && (typeof value.bestTime !== 'number' || !Number.isFinite(value.bestTime) || value.bestTime < 0)) ||
      !('completions' in value) || typeof value.completions !== 'number' || !Number.isInteger(value.completions) || value.completions < 0) return false
  return value.results.length <= 20 && value.results.every((entry: unknown) =>
    typeof entry === 'object' && entry !== null && 'date' in entry && typeof entry.date === 'string' &&
    'score' in entry && typeof entry.score === 'number' && Number.isFinite(entry.score) && entry.score >= 0 &&
    'seconds' in entry && typeof entry.seconds === 'number' && Number.isFinite(entry.seconds) && entry.seconds >= 0 &&
    'outcome' in entry && typeof entry.outcome === 'string')
}

function useHistory(slug: BreakSlug) {
  const t = usePhrase()
  const [snapshot, setHistory] = useVersionedStore<History>(`break:${slug}:history`, 1, emptyHistory, isHistory)
  const [error, setError] = useState('')
  const record = useCallback((score: number, seconds: number, outcome: string) => {
    const result = setHistory((previous) => ({
      results: [{ date: new Date().toISOString(), score, seconds, outcome }, ...previous.results].slice(0, 20),
      bestScore: Math.max(previous.bestScore, score),
      bestTime: outcome === 'Won' || outcome === 'Solved' ? Math.min(previous.bestTime ?? seconds, seconds) : previous.bestTime,
      completions: previous.completions + (outcome === 'Break completed' ? 1 : 0),
    }))
    if (!result.ok) setError(t('Result could not be saved: {error}', { error: result.error }))
    else setError('')
    if (slug !== '5-minute-break') {
      trackProductEvent('game_complete', { game_id: slug, duration_seconds: Math.round(seconds) })
    }
  }, [setHistory, slug, t])
  const saveScore = useCallback((score: number) => {
    if (score <= snapshot.value.bestScore) return
    const result = setHistory((previous) => ({ ...previous, bestScore: Math.max(previous.bestScore, score) }))
    if (!result.ok) setError(t('High score could not be saved: {error}', { error: result.error }))
    else setError('')
  }, [setHistory, snapshot.value.bestScore, t])
  return { snapshot, record, saveScore, error }
}

function formatTime(seconds: number) {
  const whole = Math.max(0, Math.floor(seconds))
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`
}

function useGameClock(limit?: number, onTimeout?: () => void) {
  const [status, setStatus] = useState<Status>('idle')
  const [elapsed, setElapsed] = useState(0)
  const started = useRef(0)
  const accumulated = useRef(0)
  useEffect(() => {
    if (status !== 'running') return
    const tick = () => {
      const current = accumulated.current + (Date.now() - started.current) / 1000
      if (limit !== undefined && current >= limit) {
        accumulated.current = limit
        setElapsed(limit)
        setStatus('finished')
        onTimeout?.()
      } else setElapsed(current)
    }
    const interval = window.setInterval(tick, 200)
    return () => window.clearInterval(interval)
  }, [status, limit, onTimeout])
  const start = () => {
    started.current = Date.now()
    setStatus('running')
  }
  const pause = () => {
    accumulated.current += (Date.now() - started.current) / 1000
    setElapsed(accumulated.current)
    setStatus('paused')
  }
  const finish = () => {
    const total = accumulated.current + (Date.now() - started.current) / 1000
    accumulated.current = total
    setElapsed(total)
    setStatus('finished')
    return total
  }
  const reset = () => {
    accumulated.current = 0
    setElapsed(0)
    setStatus('idle')
  }
  return { status, elapsed, start, pause, finish, reset }
}

const button = 'min-h-11 rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 disabled:cursor-not-allowed disabled:opacity-50'
const secondary = 'min-h-11 rounded-lg border border-slate-400 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 disabled:cursor-not-allowed disabled:opacity-50'

function usePhrase() {
  const locale = useProductLocale()
  return (source: string, values?: Record<string, string | number>) => translateProductPhrase(locale, source, values)
}

function GameShell({ title, gameId, instructions, clock, onStart, onRestart, children, history, best }: {
  title: string; gameId: BreakSlug; instructions: string; clock: ReturnType<typeof useGameClock>; onStart: () => void; onRestart: () => void
  children: React.ReactNode; history: ReturnType<typeof useHistory>; best: string
}) {
  const t = usePhrase()
  const { status, elapsed } = clock
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-xl font-semibold text-slate-900">{t(title)}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-700">{t(instructions)}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {status !== 'running' && status !== 'finished' && <button className={button} type="button" onClick={() => {
          if (status === 'idle') {
            if (gameId === '5-minute-break') trackProductEvent('break_start', { duration_seconds: 300 })
            else trackProductEvent('game_start', { game_id: gameId })
          }
          onStart()
        }}>{t(status === 'paused' ? 'Resume' : 'Start')}</button>}
        {status === 'running' && <button className={button} type="button" onClick={clock.pause}>{t('Pause')}</button>}
        <button className={secondary} type="button" onClick={onRestart}>{t('Restart')}</button>
        <span className="text-sm font-medium text-slate-700">{t('Elapsed: {time}', { time: formatTime(elapsed) })}</span>
      </div>
      <p role="status" className="mt-3 text-sm font-medium text-slate-700">{
        t(status === 'idle' ? 'Ready to start.' : status === 'running' ? 'In progress.' : status === 'paused' ? 'Paused.' : 'Finished.')
      }</p>
      <div className="mt-4">{children}</div>
      <div className="mt-6 border-t border-slate-200 pt-4 text-sm text-slate-700">
        <p className="font-semibold">{t('Local best: {score}', { score: t(best) })}</p>
        {history.snapshot.status === 'loading' && <p>{t('Loading saved history…')}</p>}
        {history.snapshot.status !== 'ready' && history.snapshot.status !== 'loading' && <p role="alert">{t('History unavailable: {error}', { error: history.snapshot.error ?? '' })}</p>}
        {history.error && <p role="alert">{t(history.error)}</p>}
        {history.snapshot.status === 'ready' && (
          <details className="mt-2">
            <summary className="cursor-pointer font-medium">{t('Recent history ({count})', { count: history.snapshot.value.results.length })}</summary>
            {history.snapshot.value.results.length === 0 ? <p className="mt-2">{t('No completed games yet.')}</p> : (
              <ul className="mt-2 space-y-1">
                {history.snapshot.value.results.map((entry, index) => <li key={`${entry.date}-${index}`}>{t(entry.outcome)} · {formatTime(entry.seconds)}{title === '2048' ? ` · ${t('{score} points', { score: entry.score })}` : ''} · {new Date(entry.date).toLocaleString()}</li>)}
              </ul>
            )}
          </details>
        )}
      </div>
    </div>
  )
}

export function BreakTool({ slug }: { slug: BreakSlug }) {
  switch (slug) {
    case '2048': return <Game2048 />
    case 'sudoku': return <Sudoku />
    case 'minesweeper': return <Minesweeper />
    case '5-minute-break': return <BreakTimer />
  }
}

function Game2048() {
  const t = usePhrase()
  const clock = useGameClock()
  const history = useHistory('2048')
  const [board, setBoard] = useState<number[]>(Array(16).fill(0))
  const [score, setScore] = useState(0)
  const [message, setMessage] = useState('Combine tiles to reach 2048.')
  const touch = useRef<{ x: number; y: number } | null>(null)
  const restart = () => { clock.reset(); setBoard(Array(16).fill(0)); setScore(0); setMessage('Combine tiles to reach 2048.') }
  const start = () => {
    if (clock.status === 'idle') setBoard(addTile(addTile(Array(16).fill(0))))
    clock.start()
  }
  const move = useCallback((direction: Direction) => {
    if (clock.status !== 'running') return
    const result = move2048(board, direction)
    if (!result.changed) return
    const next = addTile(result.board)
    const nextScore = score + result.score
    setBoard(next)
    setScore(nextScore)
    if (next.includes(2048) || !canMove2048(next)) {
      const won = next.includes(2048)
      setMessage(won ? 'You made 2048!' : 'No moves left.')
      history.record(nextScore, clock.finish(), won ? 'Won' : 'Game over')
    } else history.saveScore(nextScore)
  }, [board, clock, history, score])
  useEffect(() => {
    if (clock.status !== 'running') return
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target
      if (target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) return
      const directions: Record<string, Direction> = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' }
      if (directions[event.key]) { event.preventDefault(); move(directions[event.key]) }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [clock.status, move])
  const best = Math.max(score, history.snapshot.value.bestScore)
  return (
    <GameShell title="2048" gameId="2048" instructions="Use arrow keys, the direction buttons, or swipe the board. Matching tiles merge once per move." clock={clock} onStart={start} onRestart={restart} history={history} best={t('{score} points', { score: best })}>
      <p className="mb-2 font-semibold" aria-live="polite">{t('Score: {score}. {message}', { score, message: t(message) })}</p>
      <div className="grid w-full max-w-sm touch-none grid-cols-4 gap-2 rounded-xl bg-slate-300 p-2" role="group" aria-label={t('2048 board')} tabIndex={0}
        onTouchStart={(event) => { const point = event.touches[0]; touch.current = { x: point.clientX, y: point.clientY } }}
        onTouchEnd={(event) => {
          const point = event.changedTouches[0]
          if (!touch.current) return
          const dx = point.clientX - touch.current.x
          const dy = point.clientY - touch.current.y
          touch.current = null
          if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) return
          move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'))
        }}>
        {board.map((value, index) => <div role="img" aria-label={t('Row {row}, column {column}: {value}', { row: Math.floor(index / 4) + 1, column: index % 4 + 1, value: value || t('empty') })} key={index} className={`grid aspect-square place-items-center rounded-lg text-xl font-bold sm:text-2xl ${value ? 'bg-amber-100 text-slate-900' : 'bg-slate-200'}`}>{value || ''}</div>)}
      </div>
      <div className="mt-4 flex flex-wrap gap-2" aria-label={t('Move tiles')}>
        {(['Up', 'Left', 'Down', 'Right'] as const).map((direction, index) => <button key={direction} className={secondary} disabled={clock.status !== 'running'} type="button" onClick={() => move((['up', 'left', 'down', 'right'] as const)[index])}>{t(direction)}</button>)}
      </div>
    </GameShell>
  )
}

function Sudoku() {
  const t = usePhrase()
  const clock = useGameClock()
  const history = useHistory('sudoku')
  const [puzzle, setPuzzle] = useState<number[]>(Array(81).fill(0))
  const [board, setBoard] = useState<number[]>(Array(81).fill(0))
  const [notes, setNotes] = useState<number[][]>(Array.from({ length: 81 }, () => []))
  const [selected, setSelected] = useState(0)
  const [noteMode, setNoteMode] = useState(false)
  const [message, setMessage] = useState('Fill each row, column, and 3×3 box with 1–9.')
  const restart = () => { clock.reset(); setPuzzle(Array(81).fill(0)); setBoard(Array(81).fill(0)); setNotes(Array.from({ length: 81 }, () => [])); setSelected(0); setNoteMode(false); setMessage('Fill each row, column, and 3×3 box with 1–9.') }
  const start = () => {
    if (clock.status === 'idle') {
      const next = newSudoku()
      setPuzzle(next); setBoard(next); setNotes(Array.from({ length: 81 }, () => [])); setSelected(next.findIndex((value) => !value))
    }
    clock.start()
  }
  const enter = (value: number) => {
    if (clock.status !== 'running' || puzzle[selected]) return
    if (noteMode && value) {
      if (board[selected]) { setMessage('Clear the cell before adding notes.'); return }
      setNotes(notes.map((items, index) => index === selected ? (items.includes(value) ? items.filter((item) => item !== value) : [...items, value].sort()) : items))
      return
    }
    const next = [...board]
    next[selected] = value
    setBoard(next)
    setNotes(notes.map((items, index) => index === selected ? [] : items))
    setMessage('Entry updated. Use Check to find conflicts.')
    if (validSudoku(next, true)) {
      setMessage('Puzzle solved!')
      history.record(0, clock.finish(), 'Solved')
    }
  }
  const bestTime = history.snapshot.value.bestTime
  const best = bestTime !== null ? formatTime(bestTime) : t('No completed puzzle yet')
  return (
    <GameShell title="Sudoku" gameId="sudoku" instructions="Select an empty cell, then use 1–9 or the number buttons. Arrow keys move selection; Delete clears. Notes are optional." clock={clock} onStart={start} onRestart={restart} history={history} best={best}>
      <p className="mb-2 text-sm font-medium" aria-live="polite">{t(message)}</p>
      <div className="grid w-full max-w-lg grid-cols-9 border-2 border-slate-800" role="group" aria-label={t('Sudoku board')}
        onKeyDown={(event) => {
          if (/^[1-9]$/.test(event.key)) { event.preventDefault(); enter(Number(event.key)) }
          else if (event.key === 'Backspace' || event.key === 'Delete' || event.key === '0') { event.preventDefault(); enter(0) }
          else {
            const row = Math.floor(selected / 9), column = selected % 9
            const positions: Record<string, number> = { ArrowLeft: row * 9 + Math.max(0, column - 1), ArrowRight: row * 9 + Math.min(8, column + 1), ArrowUp: Math.max(0, row - 1) * 9 + column, ArrowDown: Math.min(8, row + 1) * 9 + column }
            if (positions[event.key] !== undefined) {
              event.preventDefault()
              const next = positions[event.key]
              setSelected(next)
              document.getElementById(`sudoku-cell-${next}`)?.focus()
            }
          }
        }}>
        {board.map((value, index) => <button id={`sudoku-cell-${index}`} type="button" key={index} disabled={clock.status !== 'running'} onClick={() => setSelected(index)} onFocus={() => setSelected(index)}
          aria-label={t('Row {row}, column {column}, {state}{value}', { row: Math.floor(index / 9) + 1, column: index % 9 + 1, state: puzzle[index] ? t('given ') : '', value: value || (notes[index].length ? t('notes {notes}', { notes: notes[index].join(', ') }) : t('empty')) })}
          aria-pressed={selected === index} className={`aspect-square min-w-0 border border-slate-300 text-sm focus:z-10 focus:outline-2 focus:outline-indigo-700 sm:text-xl ${index % 9 === 2 || index % 9 === 5 ? 'border-r-2 border-r-slate-800' : ''} ${Math.floor(index / 9) === 2 || Math.floor(index / 9) === 5 ? 'border-b-2 border-b-slate-800' : ''} ${selected === index ? 'bg-indigo-100' : puzzle[index] ? 'bg-slate-100' : 'bg-white'} ${puzzle[index] ? 'font-bold text-slate-900' : 'text-indigo-700'}`}>
          {value || <span className="text-[9px] leading-none sm:text-xs">{notes[index].join(' ')}</span>}
        </button>)}
      </div>
      <div className="mt-4 flex max-w-lg flex-wrap gap-2">
        {Array.from({ length: 9 }, (_, i) => <button className={secondary} disabled={clock.status !== 'running'} type="button" key={i} onClick={() => enter(i + 1)}>{i + 1}</button>)}
        <button className={secondary} disabled={clock.status !== 'running'} type="button" onClick={() => enter(0)}>{t('Clear')}</button>
        <button className={secondary} disabled={clock.status !== 'running'} type="button" aria-pressed={noteMode} onClick={() => setNoteMode(!noteMode)}>{t('Notes: {status}', { status: t(noteMode ? 'on' : 'off') })}</button>
        <button className={secondary} disabled={clock.status !== 'running'} type="button" onClick={() => setMessage(validSudoku(board) ? 'No conflicts found so far.' : 'There is a repeated number in a row, column, or box.')}>{t('Check')}</button>
      </div>
    </GameShell>
  )
}

function Minesweeper() {
  const t = usePhrase()
  const clock = useGameClock()
  const history = useHistory('minesweeper')
  const [board, setBoard] = useState<MineCell[] | null>(null)
  const [flags, setFlags] = useState<number[]>([])
  const [flagMode, setFlagMode] = useState(false)
  const [message, setMessage] = useState('Your first reveal is always safe.')
  const restart = () => { clock.reset(); setBoard(null); setFlags([]); setFlagMode(false); setMessage('Your first reveal is always safe.') }
  const act = (index: number, flag: boolean) => {
    if (clock.status !== 'running') return
    if (flag) {
      if (board?.[index].revealed) return
      const nextFlags = flags.includes(index) ? flags.filter((item) => item !== index) : [...flags, index]
      setFlags(nextFlags)
      if (board) setBoard(board.map((cell, i) => i === index ? { ...cell, flagged: !cell.flagged } : cell))
      return
    }
    if (flags.includes(index) || board?.[index].revealed) return
    const initial = board ?? newMineBoard(index).map((cell, i) => ({ ...cell, flagged: flags.includes(i) }))
    const next = revealMine(initial, index)
    setBoard(next)
    if (next[index].mine) {
      setMessage('Mine hit. Game over.')
      history.record(0, clock.finish(), 'Game over')
    } else if (next.every((cell) => cell.mine || cell.revealed)) {
      setMessage('All safe cells revealed. You won!')
      history.record(0, clock.finish(), 'Won')
    }
  }
  const bestTime = history.snapshot.value.bestTime
  const best = bestTime !== null ? formatTime(bestTime) : t('No wins yet')
  return (
    <GameShell title="Minesweeper" gameId="minesweeper" instructions="Reveal safe cells using the number clues. Use Flag mode or right-click to mark a mine; keyboard users can focus a cell and press F to flag." clock={clock} onStart={clock.start} onRestart={restart} history={history} best={best}>
      <p className="mb-2 text-sm font-medium" aria-live="polite">{t('{message} Flags: {flags} / {total}.', { message: t(message), flags: flags.length, total: MINE_COUNT })}</p>
      <button className={`${secondary} mb-3`} type="button" disabled={clock.status !== 'running'} aria-pressed={flagMode} onClick={() => setFlagMode(!flagMode)}>{t('Flag mode: {status}', { status: t(flagMode ? 'on' : 'off') })}</button>
      <div className="grid w-full max-w-lg grid-cols-9 gap-0.5 rounded-lg bg-slate-300 p-1" role="group" aria-label={t('Minesweeper board')}>
        {Array.from({ length: MINE_SIZE * MINE_SIZE }, (_, index) => {
          const cell = board?.[index]
          const flagged = flags.includes(index)
          const showMine = clock.status === 'finished' && cell?.mine
          const label = flagged ? 'flagged' : showMine ? 'mine' : cell?.revealed ? (cell.adjacent ? t('{count} adjacent mines', { count: cell.adjacent }) : 'empty') : 'hidden'
          return <button type="button" key={index} disabled={clock.status !== 'running'} aria-label={t('Row {row}, column {column}: {label}', { row: Math.floor(index / 9) + 1, column: index % 9 + 1, label: t(label) })}
            onClick={() => act(index, flagMode)} onContextMenu={(event) => { event.preventDefault(); act(index, true) }} onKeyDown={(event) => { if (event.key.toLowerCase() === 'f') { event.preventDefault(); act(index, true) } }}
            className={`aspect-square min-w-0 rounded text-sm font-bold focus:z-10 focus:outline-2 focus:outline-indigo-700 sm:text-lg ${cell?.revealed || showMine ? 'bg-slate-100 text-slate-900' : 'bg-slate-500 text-white hover:bg-slate-600'}`}>
            {flagged ? '⚑' : showMine ? '✹' : cell?.revealed && cell.adjacent ? cell.adjacent : ''}
          </button>
        })}
      </div>
    </GameShell>
  )
}

function BreakTimer() {
  const t = usePhrase()
  const history = useHistory('5-minute-break')
  const record = history.record
  const onTimeout = useCallback(() => record(0, 300, 'Break completed'), [record])
  const clock = useGameClock(300, onTimeout)
  const completions = history.snapshot.value.completions
  return (
    <GameShell title="5-minute break" gameId="5-minute-break" instructions="Take five minutes to stretch, breathe, or rest your eyes. The timer continues while this tab is in the background." clock={clock} onStart={clock.start} onRestart={clock.reset} history={history} best={t('{count} completed {breakLabel}', { count: completions, breakLabel: t(completions === 1 ? 'break' : 'breaks') })}>
      <p className="text-5xl font-bold tabular-nums text-indigo-800" aria-label={t('{time} remaining', { time: formatTime(Math.ceil(300 - clock.elapsed)) })}>{formatTime(Math.ceil(300 - clock.elapsed))}</p>
      <p className="mt-3 text-sm text-slate-700" role="status">{t(clock.status === 'finished' ? 'Break complete. Welcome back!' : 'A little time away can help you reset.')}</p>
    </GameShell>
  )
}
