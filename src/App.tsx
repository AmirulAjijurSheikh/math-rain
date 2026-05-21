import { useState, useRef } from 'react'
import Cloud from './components/Cloud'
import Drop from './components/Drop'
import StartScreen from './components/StartScreen'
import GameOverScreen from './components/GameOverScreen'
import LoginScreen from './components/LoginScreen'
import SignupScreen from './components/SignupScreen'
import Leaderboard from './components/Leaderboard'
import { useGameLoop } from './hooks/useGameLoop'
import { useScores } from './hooks/useScores'
import { useAuth } from './context/AuthContext'
import { playWrong } from './utils/sounds'
import type { GameSettings } from './types'
import { DEFAULT_SETTINGS } from './types'

const CLOUDS = [
  { id: 1, x: 5, y: 60, size: 'large' as const },
  { id: 2, x: 25, y: 30, size: 'medium' as const },
  { id: 3, x: 48, y: 80, size: 'small' as const },
  { id: 4, x: 65, y: 45, size: 'large' as const },
  { id: 5, x: 80, y: 25, size: 'medium' as const },
]

function App() {
  const { user, username, loading, signOut } = useAuth()
  const { saveScore } = useScores()

  const [authScreen, setAuthScreen] = useState<'login' | 'signup'>('login')
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS)
  const [showStart, setShowStart] = useState(true)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [isNewHighScore, setIsNewHighScore] = useState(false)

  const {
    drops,
    score,
    lives,
    gameRunning,
    gameOver,
    targetedId,
    startGame,
    stopGame,
    handleCorrectAnswer,
    handleWrongAnswer,
  } = useGameLoop(settings)

  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState('')
  const [scoreFlashes, setScoreFlashes] = useState<
    { id: number; x: number; y: number }[]
  >([])

  const [inputAnim, setInputAnim] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)
  const flashIdRef = useRef(0)
  const scoreSavedRef = useRef(false)

  // Save score when game ends
  const prevGameOver = useRef(false)

  if (gameOver && !prevGameOver.current && !scoreSavedRef.current) {
    prevGameOver.current = true
    scoreSavedRef.current = true

    if (user && username && score > 0) {
      saveScore(user.id, username, score, settings.difficulty)
        .then(() => setIsNewHighScore(true))
    }
  }

  if (!gameOver) {
    prevGameOver.current = false
  }

  function showScoreFlash(x: number, y: number) {
    const id = flashIdRef.current++

    setScoreFlashes(prev => [...prev, { id, x, y }])

    setTimeout(() => {
      setScoreFlashes(prev => prev.filter(f => f.id !== id))
    }, 800)
  }

  function handleAnswer(value: string) {
  const val = parseInt(value.trim(), 10)

  if (isNaN(val)) return

  // Ignore already popping drops
  const matchedDrop = drops.find(
    d => d.answer === val && !d.isPopping
  )

  if (matchedDrop) {
    // Immediately mark as popping to block double scoring
    matchedDrop.isPopping = true

    setInputAnim('flash-blue')

    setTimeout(() => setInputAnim(''), 300)

    showScoreFlash(matchedDrop.x, matchedDrop.y)

    handleCorrectAnswer(matchedDrop.id)

    setInput('')
  } else {
    if (value.length >= 2) {
      playWrong()

      setInputAnim('flash-red')

      setTimeout(() => setInputAnim(''), 300)

      handleWrongAnswer()

      setFeedback('❌ Wrong!')

      setTimeout(() => setFeedback(''), 600)
    }
  }
}

  function handleStart(s: GameSettings) {
    setSettings(s)

    setShowStart(false)

    setIsNewHighScore(false)

    scoreSavedRef.current = false

    setTimeout(() => startGame(), 100)
  }

  function handlePlayAgain() {
    stopGame()

    setShowStart(true)

    setIsNewHighScore(false)

    scoreSavedRef.current = false

    // Force page reload on mobile to clear all states cleanly
    if (window.innerWidth < 600) {
      window.location.reload()
    }
  }

  const hearts = Array.from(
    { length: 3 },
    (_, i) => (i < lives ? '❤️' : '🖤')
  )

  if (loading) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(180deg, #b8dff0 0%, #cceaf7 60%, #a8d4e8 100%)',
          fontSize: '24px',
          fontFamily: 'sans-serif',
          color: '#1565c0',
        }}
      >
        Loading...
      </div>
    )
  }

  if (!user) {
    if (authScreen === 'login') {
      return (
        <LoginScreen
          onSwitchToSignup={() => setAuthScreen('signup')}
        />
      )
    }

    return (
      <SignupScreen
        onSwitchToLogin={() => setAuthScreen('login')}
      />
    )
  }

  return (
    <>
      <div
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          background:
            'linear-gradient(180deg, #b8dff0 0%, #cceaf7 60%, #a8d4e8 100%)',
          overflow: 'hidden',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Clouds */}
        {CLOUDS.map(cloud => (
          <Cloud
            key={cloud.id}
            x={cloud.x}
            y={cloud.y}
            size={cloud.size}
          />
        ))}

        {/* Falling drops */}
        {drops.map(drop => (
          <Drop
            key={drop.id}
            x={drop.x}
            y={drop.y}
            question={drop.question}
            isTargeted={drop.id === targetedId}
            isPopping={drop.isPopping}
            isShaking={drop.isShaking}
          />
        ))}

        {/* Score flashes */}
        {scoreFlashes.map(flash => (
          <div
            key={flash.id}
            style={{
              position: 'absolute',
              left: `${flash.x}px`,
              top: `${flash.y}px`,
              color: '#1565c0',
              fontWeight: '700',
              fontSize: '20px',
              pointerEvents: 'none',
              animation: 'floatUp 0.8s ease-out forwards',
              zIndex: 20,
            }}
          >
            +20
          </div>
        ))}

        {/* Ocean */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '80px',
            background:
              'linear-gradient(180deg, #2196f3 0%, #1976d2 100%)',
          }}
        />

        {/* HUD */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 16px',
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.75)',
              borderRadius: '20px',
              padding: '6px 16px',
              fontSize: '22px',
              display: 'flex',
              gap: '4px',
            }}
          >
            {hearts}
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.75)',
              borderRadius: '12px',
              padding: '6px 18px',
              fontSize: '16px',
              fontWeight: '600',
              color: '#333',
            }}
          >
            SCORE: {score}
          </div>
        </div>

        {/* Answer input */}
        {gameRunning && (
          <div
            style={{
              position: 'absolute',
              top: window.innerWidth < 600 ? '120px' : '60px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              value={input}
              onChange={e => {
                setInput(e.target.value)
                handleAnswer(e.target.value)
              }}
              placeholder="Type answer..."
              autoFocus
              className={inputAnim}
              style={{
                padding: '10px 20px',
                borderRadius: '20px',
                border: '2px solid rgba(255,255,255,0.8)',
                background: 'rgba(255,255,255,0.9)',
                fontSize: '18px',
                textAlign: 'center',
                outline: 'none',
                width: window.innerWidth < 600 ? '160px' : '180px',
                WebkitAppearance: 'none',
              }}
            />

            <div
              style={{
                fontSize: '13px',
                fontWeight: '600',
                height: '18px',
                color: '#c62828',
              }}
            >
              {feedback}
            </div>
          </div>
        )}

        {/* Start screen */}
        {showStart && (
          <StartScreen
            onStart={handleStart}
            onLogout={() => {
              stopGame()
              signOut()
            }}
            onLeaderboard={() => setShowLeaderboard(true)}
            username={username}
          />
        )}

        {/* Game over screen */}
        {gameOver && !showStart && (
          <GameOverScreen
            score={score}
            isNewHighScore={isNewHighScore}
            onPlayAgain={handlePlayAgain}
            onLeaderboard={() => setShowLeaderboard(true)}
          />
        )}
      </div>

      {/* Leaderboard — outside main div */}
      {showLeaderboard && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
          }}
        >
          <Leaderboard
            currentUsername={username}
            onClose={() => setShowLeaderboard(false)}
          />
        </div>
      )}
    </>
  )
}

export default App