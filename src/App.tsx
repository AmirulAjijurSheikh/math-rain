import { useState, useRef } from 'react'
import Cloud from './components/Cloud'
import Drop from './components/Drop'
import { useGameLoop } from './hooks/useGameLoop'
import { playCorrect, playWrong } from './utils/sounds'

const CLOUDS = [
  { id: 1, x: 5,  y: 60,  size: 'large'  as const },
  { id: 2, x: 25, y: 30,  size: 'medium' as const },
  { id: 3, x: 48, y: 80,  size: 'small'  as const },
  { id: 4, x: 65, y: 45,  size: 'large'  as const },
  { id: 5, x: 80, y: 25,  size: 'medium' as const },
]

function App() {
  const {
    drops, score, lives,
    gameRunning, gameOver, targetedId,
    startGame, handleCorrectAnswer, handleWrongAnswer,
  } = useGameLoop()

  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState('')
  const [scoreFlashes, setScoreFlashes] = useState<
    { id: number; x: number; y: number; pts: number }[]
  >([])
  const [inputAnim, setInputAnim] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const flashIdRef = useRef(0)

  function showScoreFlash(x: number, y: number, pts: number) {
    const id = flashIdRef.current++
    setScoreFlashes(prev => [...prev, { id, x, y, pts }])
    setTimeout(() => {
      setScoreFlashes(prev => prev.filter(f => f.id !== id))
    }, 800)
  }

  function handleAnswer(value: string) {
    const val = parseInt(value.trim(), 10)
    if (isNaN(val)) return

    const matchedDrop = drops.find(d => d.answer === val)

    if (matchedDrop) {
      playCorrect()
      setInputAnim('flash-blue')
      setTimeout(() => setInputAnim(''), 300)
      showScoreFlash(matchedDrop.x, matchedDrop.y, 10)
      handleCorrectAnswer(matchedDrop.id)
      setInput('')
    } else {
      // Only show wrong feedback if input length suggests a complete answer
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

  const hearts = Array.from({ length: 3 }, (_, i) => i < lives ? '❤️' : '🖤')

  return (
    <div style={{
      position: 'relative', width: '100vw', height: '100vh',
      background: 'linear-gradient(180deg, #b8dff0 0%, #cceaf7 60%, #a8d4e8 100%)',
      overflow: 'hidden', fontFamily: 'sans-serif',
    }}>

      {/* Clouds */}
      {CLOUDS.map(cloud => (
        <Cloud key={cloud.id} x={cloud.x} y={cloud.y} size={cloud.size} />
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
          className="floatUp"
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
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
        background: 'linear-gradient(180deg, #2196f3 0%, #1976d2 100%)',
      }} />

      {/* HUD */}
      <div style={{
        position: 'absolute', top: '12px', left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '0 20px',
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.75)', borderRadius: '20px',
          padding: '6px 16px', fontSize: '22px', display: 'flex', gap: '4px',
        }}>
          {hearts}
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.75)', borderRadius: '12px',
          padding: '6px 18px', fontSize: '16px', fontWeight: '600', color: '#333',
        }}>
          SCORE: {score}
        </div>
      </div>

      {/* Answer input */}
      {gameRunning && (
        <div style={{
          position: 'absolute', top: '60px', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
        }}>
          <input
            ref={inputRef}
            type="number"
            value={input}
            onChange={e => {
              setInput(e.target.value)
              handleAnswer(e.target.value)
            }}
            placeholder="Type answer..."
            autoFocus
            className={inputAnim}
            style={{
              padding: '8px 20px', borderRadius: '20px',
              border: '2px solid rgba(255,255,255,0.8)',
              background: 'rgba(255,255,255,0.9)',
              fontSize: '16px', textAlign: 'center',
              outline: 'none', width: '180px',
            }}
          />
          <div style={{
            fontSize: '13px', fontWeight: '600', height: '18px',
            color: '#c62828',
          }}>
            {feedback}
          </div>
        </div>
      )}

      {/* Start screen */}
      {!gameRunning && !gameOver && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(255,255,255,0.88)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '16px',
        }}>
          <div style={{ fontSize: '48px' }}>🌧</div>
          <h1 style={{ fontSize: '36px', color: '#1565c0', margin: 0 }}>Math Rain</h1>
          <p style={{ color: '#555', fontSize: '16px', margin: 0 }}>
            Solve math problems before the drops hit the ocean!
          </p>
          <button onClick={startGame} style={{
            padding: '12px 40px', borderRadius: '24px', border: 'none',
            background: '#1976d2', color: '#fff',
            fontSize: '18px', fontWeight: '600', cursor: 'pointer',
          }}>
            Start Game
          </button>
        </div>
      )}

      {/* Game over screen */}
      {gameOver && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(255,255,255,0.88)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '16px',
        }}>
          <div style={{ fontSize: '48px' }}>💧</div>
          <h2 style={{ fontSize: '32px', color: '#1565c0', margin: 0 }}>Game Over!</h2>
          <p style={{ fontSize: '20px', color: '#333', margin: 0 }}>
            Final Score: <strong>{score}</strong>
          </p>
          <button onClick={startGame} style={{
            padding: '12px 40px', borderRadius: '24px', border: 'none',
            background: '#1976d2', color: '#fff',
            fontSize: '18px', fontWeight: '600', cursor: 'pointer',
          }}>
            Play Again
          </button>
        </div>
      )}

    </div>
  )
}

export default App