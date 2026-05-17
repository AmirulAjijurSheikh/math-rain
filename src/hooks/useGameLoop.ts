import type { DropData, GameSettings } from '../types'
import { useState, useEffect, useRef, useCallback } from 'react'
import { generateQuestion, randomX } from '../utils/mathEngine'
import { playSplash } from '../utils/sounds'

export function useGameLoop(settings: GameSettings) {
  const [drops, setDrops] = useState<DropData[]>([])
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameRunning, setGameRunning] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [targetedId, setTargetedId] = useState<number | null>(null)

  const dropsRef = useRef<DropData[]>([])
  const livesRef = useRef(3)
  const scoreRef = useRef(0)
  const nextIdRef = useRef(1)
  const animFrameRef = useRef<number | undefined>(undefined)
  const lastTimeRef = useRef<number>(0)
  const spawnTimerRef = useRef<number>(0)
  const dropCountRef = useRef(0)

  useEffect(() => { dropsRef.current = drops }, [drops])
  useEffect(() => { livesRef.current = lives }, [lives])
  useEffect(() => { scoreRef.current = score }, [score])

  const spawnDrop = useCallback(() => {
    const screenWidth = window.innerWidth
    const { question, answer } = generateQuestion(settings, dropCountRef.current)
    dropCountRef.current++
    const newDrop: DropData = {
      id: nextIdRef.current++,
      x: randomX(screenWidth),
      y: -(window.innerWidth < 600 ? 120 : 90),
      question,
      answer,
      speed: settings.difficulty === 'easy'   ? 0.03 + (scoreRef.current / 25000)
           : settings.difficulty === 'medium' ? 0.05 + (scoreRef.current / 20000)
           : 0.07 + (scoreRef.current / 15000),
      isPopping: false,
      isShaking: false,
    }
    dropsRef.current = [...dropsRef.current, newDrop]
    setDrops([...dropsRef.current])
    setTargetedId(prev => prev ?? newDrop.id)
  }, [settings])

  const gameLoop = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp
    const delta = timestamp - lastTimeRef.current
    lastTimeRef.current = timestamp

    // Skip frame if delta too large — keyboard open, tab switch, resize
    if (delta > 200) {
      animFrameRef.current = requestAnimationFrame(gameLoop)
      return
    }

    const oceanY = window.innerHeight - 80

    const updatedDrops = dropsRef.current.map(drop => ({
      ...drop,
      y: drop.isPopping ? drop.y : drop.y + drop.speed * delta,
    }))

    const survivingDrops: DropData[] = []
    let livesLost = 0

    updatedDrops.forEach(drop => {
      if (!drop.isPopping && drop.y + 90 >= oceanY) {
        livesLost++
        playSplash()
      } else {
        survivingDrops.push(drop)
      }
    })

    if (livesLost > 0) {
      const newLives = livesRef.current - livesLost
      livesRef.current = newLives
      setLives(newLives)
      if (newLives <= 0) {
        setGameRunning(false)
        setGameOver(true)
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
        return
      }
    }

    dropsRef.current = survivingDrops
    setDrops([...survivingDrops])

    const activeDrop = survivingDrops.filter(d => !d.isPopping)
    if (activeDrop.length > 0) {
      const lowest = activeDrop.reduce((a, b) => a.y > b.y ? a : b)
      setTargetedId(lowest.id)
    } else {
      setTargetedId(null)
    }

    spawnTimerRef.current += delta
    const spawnInterval = scoreRef.current < 100
      ? Math.max(500, 1000 - scoreRef.current * 2)
      : Math.max(2000, 2000 - scoreRef.current * 1)

    const maxDrops = scoreRef.current < 150
      ? 1
      : Math.min(4, 2 + Math.floor((scoreRef.current - 150) / 150))

    if (spawnTimerRef.current >= spawnInterval) {
      spawnTimerRef.current = 0
      if (dropsRef.current.length < maxDrops) spawnDrop()
    }

    animFrameRef.current = requestAnimationFrame(gameLoop)
  }, [spawnDrop])

  const startGame = useCallback(() => {
    dropCountRef.current = 0
    dropsRef.current = []
    livesRef.current = 3
    scoreRef.current = 0
    nextIdRef.current = 1
    lastTimeRef.current = 0
    spawnTimerRef.current = 0

    setDrops([])
    setLives(3)
    setScore(0)
    setGameOver(false)
    setTargetedId(null)
    setGameRunning(true)

    setTimeout(() => spawnDrop(), 500)
    animFrameRef.current = requestAnimationFrame(gameLoop)
  }, [gameLoop, spawnDrop])

  const handleCorrectAnswer = useCallback((dropId: number) => {
    const newScore = scoreRef.current + 20
    scoreRef.current = newScore
    setScore(newScore)

    setDrops(prev => prev.map(d =>
      d.id === dropId ? { ...d, isPopping: true } : d
    ))
    setTimeout(() => {
      dropsRef.current = dropsRef.current.filter(d => d.id !== dropId)
      setDrops([...dropsRef.current])
    }, 300)
  }, [])

  const handleWrongAnswer = useCallback(() => {
    setTargetedId(prev => {
      if (prev === null) return prev
      setDrops(d => d.map(drop =>
        drop.id === prev ? { ...drop, isShaking: true } : drop
      ))
      setTimeout(() => {
        setDrops(d => d.map(drop =>
          drop.id === prev ? { ...drop, isShaking: false } : drop
        ))
      }, 400)
      return prev
    })
  }, [])

  // Reset timer on visibility change AND resize (keyboard open on mobile)
  useEffect(() => {
    function handleReset() {
      lastTimeRef.current = 0
    }
    document.addEventListener('visibilitychange', handleReset)
    window.addEventListener('resize', handleReset)
    return () => {
      document.removeEventListener('visibilitychange', handleReset)
      window.removeEventListener('resize', handleReset)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  const stopGame = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    dropsRef.current = []
    setDrops([])
    setGameRunning(false)
  }, [])

  return {
    drops,
    score,
    lives,
    gameRunning,
    gameOver,
    targetedId,
    startGame,
    handleCorrectAnswer,
    handleWrongAnswer,
    stopGame
  }
}