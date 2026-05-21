import type { GameSettings } from '../types'

export interface Question {
  question: string
  answer: number
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateEasyQuestion(op: string): { a: number, b: number, answer: number } {
  let a: number, b: number, answer: number
  if (op === '+') {
    a = rand(1, 19); b = rand(1, 19); answer = a + b
  } else if (op === '-') {
    a = rand(2, 20); b = rand(1, a); answer = a - b
  } else if (op === '×') {
    a = rand(1, 5); b = rand(1, 5); answer = a * b
  } else {
    answer = rand(1, 5); b = rand(2, 5); a = answer * b
  }
  return { a, b, answer }
}

function generateMediumQuestion(op: string): { a: number, b: number, answer: number } {
  let a: number, b: number, answer: number
  if (op === '+') {
    a = rand(1, 99); b = rand(1, 99); answer = a + b
  } else if (op === '-') {
    a = rand(1, 99); b = rand(1, 99)
    if (b > a) { const temp = a; a = b; b = temp }
    if (a === b) { a += rand(1, 9) }
    answer = a - b
  } else if (op === '×') {
    a = rand(2, 9); b = rand(2, 9); answer = a * b
  } else {
    answer = rand(2, 9); b = rand(2, 9); a = answer * b
  }
  return { a, b, answer }
}

function generateHardQuestion(op: string): { a: number, b: number, answer: number } {
  let a: number, b: number, answer: number
  if (op === '+') {
    a = rand(1, 99); b = rand(1, 99); answer = a + b
  } else if (op === '-') {
    // Can be negative in hard
    a = rand(1, 99); b = rand(1, 99); answer = a - b
  } else if (op === '×') {
    a = rand(2, 12); b = rand(2, 12); answer = a * b
  } else {
    answer = rand(2, 12); b = rand(2, 12); a = answer * b
  }
  return { a, b, answer }
}

export function generateQuestion(
  settings: GameSettings,
  dropCount: number,
  score: number = 0
): Question {
  // First 5 drops — always easy single digit addition
  if (dropCount <= 5) {
    const a = rand(1, 9)
    const b = rand(1, 9)
    return { question: `${a} + ${b}`, answer: a + b }
  }

  const ops: string[] = []
  if (settings.operations.addition)       ops.push('+')
  if (settings.operations.subtraction)    ops.push('-')
  if (settings.operations.multiplication) ops.push('×')
  if (settings.operations.division)       ops.push('/')
  if (ops.length === 0) ops.push('+')

  const op = ops[Math.floor(Math.random() * ops.length)]

  let result: { a: number, b: number, answer: number }

  if (settings.difficulty === 'easy') {
    result = generateEasyQuestion(op)

  } else if (settings.difficulty === 'medium') {
    // Hard question frequency increases every 200 points
    // 0-200: 10%, 200-400: 20%, 400-600: 30%, 600+: 40%
    const hardChance = Math.min(0.4, 0.1 + Math.floor(score / 200) * 0.1)
    const useHard = Math.random() < hardChance
    result = useHard ? generateHardQuestion(op) : generateMediumQuestion(op)

  } else {
    // Hard — always hard questions
    result = generateHardQuestion(op)
  }

  return { question: `${result.a} ${op} ${result.b}`, answer: result.answer }
}

export function randomX(screenWidth: number): number {
  return Math.floor(Math.random() * (screenWidth - 140)) + 40
}