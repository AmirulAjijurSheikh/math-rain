import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface ScoreEntry {
  username: string
  score: number
  difficulty: string
}

interface Props {
  currentUsername: string | null
  onClose: () => void
}

function Leaderboard({ currentUsername, onClose }: Props) {
  const [scores, setScores] = useState<ScoreEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')

  useEffect(() => {
    fetchScores()
  }, [difficulty])

  async function fetchScores() {
    setLoading(true)
    const { data } = await supabase
      .from('scores')
      .select('username, score, difficulty')
      .eq('difficulty', difficulty)
      .order('score', { ascending: false })
      .limit(10)

    setScores(data || [])
    setLoading(false)
  }

  const medals = ['🥇', '🥈', '🥉']

  const tabStyle = (d: string) => ({
    padding: '8px 20px',
    borderRadius: '20px',
    border: 'none',
    background: difficulty === d ? '#1976d2' : 'transparent',
    color: difficulty === d ? '#fff' : '#888',
    fontSize: '14px',
    fontWeight: '600' as const,
    cursor: 'pointer',
  })

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 100,
    }}>
      <div style={{
        background: '#fff', borderRadius: '24px',
        padding: '32px', width: '100%', maxWidth: '460px',
        fontFamily: 'sans-serif',
        maxHeight: '80vh', overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '20px',
        }}>
          <h2 style={{ margin: 0, fontSize: '24px', color: '#1565c0' }}>
            🏆 Leaderboard
          </h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none',
            fontSize: '22px', cursor: 'pointer', color: '#888',
          }}>✕</button>
        </div>

        {/* Difficulty tabs */}
        <div style={{
          display: 'flex', gap: '4px',
          background: '#f5f5f5', borderRadius: '24px',
          padding: '4px', marginBottom: '20px',
        }}>
          <button style={tabStyle('easy')}   onClick={() => setDifficulty('easy')}>Easy</button>
          <button style={tabStyle('medium')} onClick={() => setDifficulty('medium')}>Medium</button>
          <button style={tabStyle('hard')}   onClick={() => setDifficulty('hard')}>Hard</button>
        </div>

        {/* Scores */}
        {loading ? (
          <p style={{ textAlign: 'center', color: '#888' }}>Loading...</p>
        ) : scores.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888' }}>
            No scores yet — be the first! 🎮
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {scores.map((entry, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center',
                  padding: '12px 16px', borderRadius: '12px',
                  background: entry.username === currentUsername
                    ? '#e3f2fd' : i % 2 === 0 ? '#fafafa' : '#fff',
                  border: entry.username === currentUsername
                    ? '2px solid #90caf9' : '1px solid #f0f0f0',
                }}
              >
                {/* Rank */}
                <span style={{ fontSize: '20px', width: '36px' }}>
                  {i < 3 ? medals[i] : `${i + 1}.`}
                </span>

                {/* Username */}
                <span style={{
                  flex: 1, fontWeight: '600', fontSize: '15px',
                  color: entry.username === currentUsername ? '#1565c0' : '#333',
                }}>
                  {entry.username}
                  {entry.username === currentUsername && (
                    <span style={{
                      marginLeft: '8px', fontSize: '11px',
                      background: '#1976d2', color: '#fff',
                      padding: '2px 8px', borderRadius: '10px',
                    }}>
                      You
                    </span>
                  )}
                </span>

                {/* Score */}
                <span style={{
                  fontWeight: '700', fontSize: '18px', color: '#1565c0',
                }}>
                  {entry.score}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Leaderboard