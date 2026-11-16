const slugs = ['2048', 'sudoku', 'minesweeper', '5-minute-break'] as const
export type BreakSlug = typeof slugs[number]
export function isBreakSlug(slug: string): slug is BreakSlug {
  return slugs.some((entry) => entry === slug)
}

export type Direction = 'up' | 'down' | 'left' | 'right'

export function addTile(board: number[], random = Math.random): number[] {
  const empty = board.map((value, index) => value === 0 ? index : -1).filter((index) => index >= 0)
  if (!empty.length) return board
  const next = [...board]
  next[empty[Math.floor(random() * empty.length)]] = random() < 0.9 ? 2 : 4
  return next
}

export function move2048(board: number[], direction: Direction) {
  const next = [...board]
  let score = 0
  for (let line = 0; line < 4; line++) {
    const indices = Array.from({ length: 4 }, (_, position) => {
      switch (direction) {
        case 'left': return line * 4 + position
        case 'right': return line * 4 + 3 - position
        case 'up': return position * 4 + line
        case 'down': return (3 - position) * 4 + line
      }
    })
    const values = indices.map((index) => board[index]).filter(Boolean)
    const merged: number[] = []
    for (let i = 0; i < values.length; i++) {
      if (values[i] === values[i + 1]) {
        const value = values[i] * 2
        merged.push(value)
        score += value
        i++
      } else merged.push(values[i])
    }
    indices.forEach((index, position) => { next[index] = merged[position] ?? 0 })
  }
  return { board: next, score, changed: next.some((value, index) => value !== board[index]) }
}

export function canMove2048(board: number[]) {
  return (['left', 'right', 'up', 'down'] as const).some((direction) => move2048(board, direction).changed)
}

// This uniquely solvable puzzle is randomized by digit and row/column permutations.
const sudokuSeed = [
  5,3,0,0,7,0,0,0,0, 6,0,0,1,9,5,0,0,0, 0,9,8,0,0,0,0,6,0,
  8,0,0,0,6,0,0,0,3, 4,0,0,8,0,3,0,0,1, 7,0,0,0,2,0,0,0,6,
  0,6,0,0,0,0,2,8,0, 0,0,0,4,1,9,0,0,5, 0,0,0,0,8,0,0,7,9,
]

function shuffle<T>(values: T[], random: () => number) {
  const result = [...values]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function newSudoku(random = Math.random) {
  const digits = shuffle([1,2,3,4,5,6,7,8,9], random)
  const order = () => shuffle([0,1,2], random).flatMap((group) => shuffle([0,1,2], random).map((offset) => group * 3 + offset))
  const rows = order()
  const columns = order()
  return rows.flatMap((row) => columns.map((column) => {
    const value = sudokuSeed[row * 9 + column]
    return value ? digits[value - 1] : 0
  }))
}

export function validSudoku(board: number[], complete = false) {
  if (board.length !== 81 || board.some((value) => !Number.isInteger(value) || value < (complete ? 1 : 0) || value > 9)) return false
  const valid = (values: number[]) => {
    const filled = values.filter(Boolean)
    return new Set(filled).size === filled.length
  }
  for (let i = 0; i < 9; i++) {
    if (!valid(board.slice(i * 9, i * 9 + 9)) || !valid(board.filter((_, index) => index % 9 === i))) return false
    const row = Math.floor(i / 3) * 3
    const column = (i % 3) * 3
    if (!valid(Array.from({ length: 9 }, (_, j) => board[(row + Math.floor(j / 3)) * 9 + column + j % 3]))) return false
  }
  return true
}

export type MineCell = { mine: boolean; adjacent: number; revealed: boolean; flagged: boolean }
export const MINE_SIZE = 9
export const MINE_COUNT = 10

export function neighbors(index: number) {
  const row = Math.floor(index / MINE_SIZE)
  const column = index % MINE_SIZE
  const result: number[] = []
  for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
    const r = row + dr
    const c = column + dc
    if ((dr || dc) && r >= 0 && r < MINE_SIZE && c >= 0 && c < MINE_SIZE) result.push(r * MINE_SIZE + c)
  }
  return result
}

export function newMineBoard(first: number, random = Math.random): MineCell[] {
  const candidates = Array.from({ length: MINE_SIZE * MINE_SIZE }, (_, index) => index).filter((index) => index !== first)
  const mines = new Set(shuffle(candidates, random).slice(0, MINE_COUNT))
  return candidatesBoard(mines)
}

function candidatesBoard(mines: Set<number>): MineCell[] {
  return Array.from({ length: MINE_SIZE * MINE_SIZE }, (_, index) => ({
    mine: mines.has(index), adjacent: neighbors(index).filter((neighbor) => mines.has(neighbor)).length,
    revealed: false, flagged: false,
  }))
}

export function revealMine(board: MineCell[], index: number) {
  const next = board.map((cell) => ({ ...cell }))
  const queue = [index]
  while (queue.length) {
    const current = queue.pop()!
    const cell = next[current]
    if (cell.revealed || cell.flagged) continue
    cell.revealed = true
    if (!cell.mine && cell.adjacent === 0) queue.push(...neighbors(current))
  }
  return next
}
