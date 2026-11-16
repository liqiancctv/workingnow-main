import test from 'node:test'
import assert from 'node:assert/strict'
import { addTile, canMove2048, move2048, newMineBoard, newSudoku, neighbors, revealMine, validSudoku, MINE_COUNT } from './logic.ts'

test('2048 merges once per tile in each direction and detects blocked boards', () => {
  const board = [2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  assert.deepEqual(move2048(board, 'left').board.slice(0, 4), [4, 4, 0, 0])
  assert.deepEqual(move2048(board, 'right').board.slice(0, 4), [0, 0, 4, 4])
  assert.equal(move2048(board, 'left').score, 8)
  assert.deepEqual(move2048([2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0], 'down').board.filter(Boolean), [4, 4])
  assert.equal(move2048(board, 'up').changed, false)
  assert.equal(canMove2048([2, 4, 2, 4, 4, 2, 4, 2, 2, 4, 2, 4, 4, 2, 4, 2]), false)
  assert.equal(addTile(Array(16).fill(0), () => 0)[0], 2)
})

function countSolutions(puzzle) {
  const board = [...puzzle]
  let count = 0
  function solve() {
    if (count > 1) return
    let bestIndex = -1
    let bestValues = []
    for (let i = 0; i < 81; i++) {
      if (board[i]) continue
      const values = []
      for (let value = 1; value <= 9; value++) {
        board[i] = value
        if (validSudoku(board)) values.push(value)
      }
      board[i] = 0
      if (!values.length) return
      if (bestIndex === -1 || values.length < bestValues.length) { bestIndex = i; bestValues = values }
    }
    if (bestIndex === -1) { count++; return }
    for (const value of bestValues) {
      board[bestIndex] = value
      solve()
      board[bestIndex] = 0
    }
  }
  solve()
  return count
}

test('generated Sudoku puzzles have one solution and checking validates all units', () => {
  for (let seed = 1; seed <= 10; seed++) {
    let state = seed
    const random = () => { state = (state * 16807) % 2147483647; return (state - 1) / 2147483646 }
    const puzzle = newSudoku(random)
    assert.equal(validSudoku(puzzle), true)
    assert.equal(countSolutions(puzzle), 1)
    assert.equal(validSudoku(puzzle, true), false)
  }
  const solved = [
    5,3,4,6,7,8,9,1,2, 6,7,2,1,9,5,3,4,8, 1,9,8,3,4,2,5,6,7,
    8,5,9,7,6,1,4,2,3, 4,2,6,8,5,3,7,9,1, 7,1,3,9,2,4,8,5,6,
    9,6,1,5,3,7,2,8,4, 2,8,7,4,1,9,6,3,5, 3,4,5,2,8,6,1,7,9,
  ]
  assert.equal(validSudoku(solved, true), true)
  solved[0] = solved[1]
  assert.equal(validSudoku(solved, true), false)
})

test('Minesweeper protects every possible first click and counts neighbors accurately', () => {
  for (let first = 0; first < 81; first++) {
    const board = newMineBoard(first, () => 0.5)
    assert.equal(board[first].mine, false)
    assert.equal(board.filter((cell) => cell.mine).length, MINE_COUNT)
    for (let i = 0; i < 81; i++) assert.equal(board[i].adjacent, neighbors(i).filter((neighbor) => board[neighbor].mine).length)
    assert.equal(revealMine(board, first)[first].revealed, true)
  }
  const empty = Array.from({ length: 81 }, () => ({ mine: false, adjacent: 0, flagged: false, revealed: false }))
  empty[80].flagged = true
  const revealed = revealMine(empty, 0)
  assert.equal(revealed.filter((cell) => cell.revealed).length, 80)
  assert.equal(revealed[80].revealed, false)
})
