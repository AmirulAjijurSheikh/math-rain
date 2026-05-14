export interface DropData {
  id: number
  x: number
  y: number
  question: string
  answer: number
  speed: number
  isPopping: boolean
  isShaking: boolean
}

export interface GameSettings {
  difficulty: 'easy' | 'medium' | 'hard'
  operations: {
    addition: boolean
    subtraction: boolean
    multiplication: boolean
    division: boolean
  }
}

export const DEFAULT_SETTINGS: GameSettings = {
  difficulty: 'easy',
  operations: {
    addition: true,
    subtraction: true,
    multiplication: true,
    division: true,
  }
}