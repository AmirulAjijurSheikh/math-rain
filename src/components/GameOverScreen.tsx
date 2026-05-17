interface Props {
  score: number
  isNewHighScore: boolean
  onPlayAgain: () => void
  onLeaderboard: () => void
}

function GameOverScreen({ score, isNewHighScore, onPlayAgain, onLeaderboard }: Props) {
  const getMessage = () => {
    if (score >= 300) return { emoji: '🏆', msg: 'Outstanding!' }
    if (score >= 200) return { emoji: '🌟', msg: 'Great job!' }
    if (score >= 100) return { emoji: '👏', msg: 'Good effort!' }
    return { emoji: '💪', msg: 'Keep practicing!' }
  }

  const { emoji, msg } = getMessage()

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(255,255,255,0.92)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '16px', fontFamily: 'sans-serif',
    }}>
      <div style={{ fontSize: '56px' }}>{emoji}</div>
      <h2 style={{ fontSize: '36px', color: '#1565c0', margin: 0 }}>
        Game Over!
      </h2>
      <p style={{ fontSize: '20px', color: '#555', margin: 0 }}>{msg}</p>

      {/* New high score badge */}
      {isNewHighScore && (
        <div style={{
          background: '#fff9c4', border: '2px solid #f9a825',
          borderRadius: '12px', padding: '8px 20px',
          fontSize: '15px', fontWeight: '600', color: '#f57f17',
        }}>
          🎉 New Personal Best!
        </div>
      )}

      {/* Score card */}
      <div style={{
        background: '#f0f7ff', borderRadius: '16px',
        padding: '20px 48px', textAlign: 'center',
        border: '2px solid #bbdefb',
      }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>FINAL SCORE</p>
        <p style={{ margin: '4px 0 0', fontSize: '48px', fontWeight: '700', color: '#1565c0' }}>
          {score}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <button
          onClick={onLeaderboard}
          style={{
            padding: '12px 28px', borderRadius: '12px',
            border: '2px solid #1976d2',
            background: '#fff', color: '#1976d2',
            fontSize: '16px', fontWeight: '600', cursor: 'pointer',
          }}
        >
          🏆 Leaderboard
        </button>
        <button
          onClick={onPlayAgain}
          style={{
            padding: '12px 28px', borderRadius: '12px', border: 'none',
            background: '#1976d2', color: '#fff',
            fontSize: '16px', fontWeight: '600', cursor: 'pointer',
          }}
        >
          Play Again 🎮
        </button>
      </div>
    </div>
  )
}

export default GameOverScreen