export interface Question {
  question: string
  answer: number
}

export function generateQuestion(): Question {
  const ops = ['+', '-', '×', '/']
  const op = ops[Math.floor(Math.random() * ops.length)]

  let a: number, b: number, answer: number

  if (op === '+') {
    a = Math.floor(Math.random() * 40) + 2
    b = Math.floor(Math.random() * 40) + 2
    answer = a + b
  } else if (op === '-') {
    a = Math.floor(Math.random() * 48) + 10
    b = Math.floor(Math.random() * (a - 1)) + 1
    answer = a - b  // always positive like real game
  } else if (op === '×') {
    a = Math.floor(Math.random() * 9) + 2
    b = Math.floor(Math.random() * 9) + 2
    answer = a * b
  } else {
    // Clean whole number division e.g. 48 ÷ 6
    answer = Math.floor(Math.random() * 10) + 1
    b = Math.floor(Math.random() * 9) + 2
    a = answer * b
  }

  return { question: `${a} ${op} ${b}`, answer }
}

export function randomX(screenWidth: number): number {
  return Math.floor(Math.random() * (screenWidth - 140)) + 40
}