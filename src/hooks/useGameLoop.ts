import { useState, useEffect, useRef, useCallback } from 'react'
import type { DropData } from '../types'
import { generateQuestion, randomX } from '../utils/mathEngine'

export function useGameLoop() {
  const [drops, setDrops] = useState<DropData[]>([])
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameRunning, setGameRunning] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [level, setLevel] = useState(1)
  const [targetedId, setTargetedId] = useState<number | null>(null)

  // useRef stores values the game loop can access without re-rendering
  const dropsRef = useRef<DropData[]>([])
  const livesRef = useRef(3)
  const scoreRef = useRef(0)
  const nextIdRef = useRef(1)
  const animFrameRef = useRef<number | undefined>(undefined)
  const lastTimeRef = useRef<number>(0)
  const spawnTimerRef = useRef<number>(0)

  // Keep refs in sync with state
  useEffect(() => { dropsRef.current = drops }, [drops])
  useEffect(() => { livesRef.current = lives }, [lives])
  useEffect(() => { scoreRef.current = score }, [score])

  // Spawn a new drop
  const spawnDrop = useCallback(() => {
    const screenWidth = window.innerWidth
    const { question, answer } = generateQuestion()
    const newDrop: DropData = {
      id: nextIdRef.current++,
      x: randomX(screenWidth),
      y: -100,
      question,
      answer,
      // Starts slow, increases gently with score
      speed: 0.03 + (scoreRef.current / 25000),
    }
    dropsRef.current = [...dropsRef.current, newDrop]
    setDrops([...dropsRef.current])

    // Auto-target the first drop if nothing targeted
    setTargetedId(prev => prev ?? newDrop.id)
  }, [level])

  // Main game loop — runs 60 times per second
  const gameLoop = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp
    const delta = timestamp - lastTimeRef.current
    lastTimeRef.current = timestamp

    const oceanY = window.innerHeight - 80

    // Move every drop down by speed × delta
    let updatedDrops = dropsRef.current.map(drop => ({
      ...drop,
      y: drop.y + drop.speed * delta,
    }))

    // Check if any drop hit the ocean
    const survivingDrops: DropData[] = []
    let livesLost = 0

    updatedDrops.forEach(drop => {
      if (drop.y + 90 >= oceanY) {
        livesLost++
      } else {
        survivingDrops.push(drop)
      }
    })

    // Lose lives for drops that hit ocean
    if (livesLost > 0) {
      const newLives = livesRef.current - livesLost
      livesRef.current = newLives
      setLives(newLives)

      if (newLives <= 0) {
        setGameRunning(false)
        setGameOver(true)
        cancelAnimationFrame(animFrameRef.current!)
        return
      }
    }

    dropsRef.current = survivingDrops
    setDrops([...survivingDrops])

    // Auto-target lowest drop
    if (survivingDrops.length > 0) {
      const lowest = survivingDrops.reduce((a, b) => a.y > b.y ? a : b)
      setTargetedId(lowest.id)
    } else {
      setTargetedId(null)
    }

    // Spawn new drop every 2.5 seconds
    spawnTimerRef.current += delta
    
    // Track how many drops have been answered
    const spawnInterval = scoreRef.current < 100
        ? Math.max(500, 1000 - scoreRef.current * 2)  // first 6-7 drops: spawn quickly
        : Math.max(2000, 2000 - scoreRef.current * 1)  // after that: slower spawn, more drops at once

    const maxDrops = scoreRef.current < 150
        ? 1                                              // first 6-7 drops: always 1 at a time
        : Math.min(4, 2 + Math.floor((scoreRef.current - 150) / 150)) // then: 2-3 alternating

    if (spawnTimerRef.current >= spawnInterval) {
        spawnTimerRef.current = 0
        if (dropsRef.current.length < maxDrops) spawnDrop()
    }

    animFrameRef.current = requestAnimationFrame(gameLoop)
  }, [level, spawnDrop])

  // Start the game
  const startGame = useCallback(() => {
    // Reset everything
    dropsRef.current = []
    livesRef.current = 3
    scoreRef.current = 0
    nextIdRef.current = 1
    lastTimeRef.current = 0
    spawnTimerRef.current = 0

    setDrops([])
    setLives(3)
    setScore(0)
    setLevel(1)
    setGameOver(false)
    setTargetedId(null)
    setGameRunning(true)

    // Spawn first drop immediately
    setTimeout(() => spawnDrop(), 500)
    animFrameRef.current = requestAnimationFrame(gameLoop)
  }, [gameLoop, spawnDrop])

  // Handle a correct answer
  const handleCorrectAnswer = useCallback((dropId: number) => {
    const points = 10 + level * 5
    const newScore = scoreRef.current + points
    scoreRef.current = newScore
    setScore(newScore)

    

    // Remove the answered drop
    dropsRef.current = dropsRef.current.filter(d => d.id !== dropId)
    setDrops([...dropsRef.current])
  }, [level])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
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
  }
}