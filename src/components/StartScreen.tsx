import { useState } from 'react'
import type { GameSettings } from '../types'

interface Props {
  onStart: (settings: GameSettings) => void
  onLogout: () => void
  onLeaderboard: () => void
  username: string | null
}

function StartScreen({ onStart, onLogout, onLeaderboard, username }: Props) {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [ops, setOps] = useState({
    addition: true,
    subtraction: true,
    multiplication: true,
    division: true,
  })

  function toggleOp(op: keyof typeof ops) {
    const active = Object.values(ops).filter(Boolean).length
    if (ops[op] && active === 1) return
    setOps(prev => ({ ...prev, [op]: !prev[op] }))
  }

  function handleStart() {
    onStart({
      difficulty,
      operations: ops,
    })
  }

  const diffBtnStyle = (d: string) => ({
    padding: '10px 28px',
    borderRadius: '20px',
    border: '2px solid',
    borderColor: difficulty === d ? '#1976d2' : '#ccc',
    background: difficulty === d ? '#1976d2' : '#fff',
    color: difficulty === d ? '#fff' : '#555',
    fontSize: '15px',
    fontWeight: '600' as const,
    cursor: 'pointer',
    transition: 'all 0.2s',
  })

  const opBtnStyle = (active: boolean) => ({
    padding: '8px 20px',
    borderRadius: '16px',
    border: '2px solid',
    borderColor: active ? '#1565c0' : '#ccc',
    background: active ? 'rgba(21,101,192,0.1)' : '#fff',
    color: active ? '#1565c0' : '#999',
    fontSize: '18px',
    fontWeight: '700' as const,
    cursor: 'pointer',
    transition: 'all 0.2s',
  })

  return (

    
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(255,255,255,0.92)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'flex-start',
      gap: '24px',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.92)',
        borderRadius: '24px',
        padding: '32px 24px',
        width: '90%',
        maxWidth: '500px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '20px',
      }}>

        {/* Title */}
        <div style={{ fontSize: '52px' }}>🌧</div>
        <h1 style={{ fontSize: '40px', color: '#1565c0', margin: 0, fontFamily: 'sans-serif' }}>
          Math Rain
        </h1>

        {/* Username */}
        <p style={{ color: '#1976d2', fontSize: '14px', fontWeight: '600', margin: 0 }}>
          👤 {username}
        </p>

        <p style={{ color: '#666', fontSize: '15px', margin: 0, fontFamily: 'sans-serif' }}>
          Solve math problems before the drops hit the ocean!
        </p>

        
        {/* Benefits */}
        <div style={{
          borderRadius: '16px',
          padding: '14px 20px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}>
        <p style={{ margin: 0, fontSize: '12px', fontWeight: '600', color: '#1565c0', fontFamily: 'sans-serif' }}>
          🧠 What you improve
        </p>
        <p style={{ margin: 0, fontSize: '12px', color: '#555', fontFamily: 'sans-serif', lineHeight: '2' }}>
          ⚡ Ability to think under time and pressure<br/>
          🎯 Focus & composure in stress<br/>
          🧩 Build longer attention span
        </p>
    </div>

        {/* Difficulty */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <p style={{ margin: 0, fontWeight: '600', color: '#444', fontFamily: 'sans-serif' }}>
            Difficulty
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={diffBtnStyle('easy')}   onClick={() => setDifficulty('easy')}>Easy</button>
            <button style={diffBtnStyle('medium')} onClick={() => setDifficulty('medium')}>Medium</button>
            <button style={diffBtnStyle('hard')}   onClick={() => setDifficulty('hard')}>Hard</button>
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          style={{
            padding: '14px 50px', borderRadius: '28px', border: 'none',
            background: '#1976d2', color: '#fff',
            fontSize: '20px', fontWeight: '600', cursor: 'pointer',
            fontFamily: 'sans-serif', marginTop: '8px',
            boxShadow: '0 4px 14px rgba(25,118,210,0.4)',
          }}
        >
          Start Game 🎮
        </button>

        {/* Leaderboard button */}
        <button
          onClick={onLeaderboard}
          style={{
            padding: '10px 28px', borderRadius: '20px',
            border: '2px solid #1976d2',
            background: 'transparent', color: '#1976d2',
            fontSize: '14px', fontWeight: '600', cursor: 'pointer',
          }}
        >
          🏆 Leaderboard
        </button>

        {/* Logout button */}
        <button
          onClick={onLogout}
          style={{
            padding: '10px 28px', borderRadius: '20px',
            border: '2px solid #e57373',
            background: 'transparent', color: '#c62828',
            fontSize: '14px', fontWeight: '600', cursor: 'pointer',
          }}
        >
          Logout
        </button>

        

      </div>
    </div>
  )
}

export default StartScreen