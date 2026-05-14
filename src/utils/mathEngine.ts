import type { GameSettings } from '../types'

export interface Question {
  question: string
  answer: number
}

export function generateQuestion(settings: GameSettings): Question {
  // Build ops list based on player's toggles
  const ops: string[] = []
  if (settings.operations.addition)       ops.push('+')
  if (settings.operations.subtraction)    ops.push('-')
  if (settings.operations.multiplication) ops.push('*')
  if (settings.operations.division)       ops.push('/')
  if (ops.length === 0) ops.push('+') // fallback

  const op = ops[Math.floor(Math.random() * ops.length)]

  // Number ranges based on difficulty
  const max = settings.difficulty === 'easy' ? 10
            : settings.difficulty === 'medium' ? 25
            : 50

  let a: number, b: number, answer: number

  if (op === '+') {
    a = Math.floor(Math.random() * max) + 1
    b = Math.floor(Math.random() * max) + 1
    answer = a + b
  } else if (op === '-') {
    a = Math.floor(Math.random() * max) + 10
    b = Math.floor(Math.random() * a) + 1
    answer = a - b
  } else if (op === '*') {
    const mmax = settings.difficulty === 'easy' ? 5
               : settings.difficulty === 'medium' ? 9 : 12
    a = Math.floor(Math.random() * mmax) + 2
    b = Math.floor(Math.random() * mmax) + 2
    answer = a * b
  } else {
    answer = Math.floor(Math.random() * 10) + 1
    b = Math.floor(Math.random() * 9) + 2
    a = answer * b
  }

  return { question: `${a} ${op} ${b}`, answer }
}

export function randomX(screenWidth: number): number {
  return Math.floor(Math.random() * (screenWidth - 140)) + 40
}