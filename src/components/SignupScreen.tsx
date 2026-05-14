import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

interface Props {
  onSwitchToLogin: () => void
}

function SignupScreen({ onSwitchToLogin }: Props) {
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup() {
    if (!email || !password || !username) {
      setError('Please fill in all fields')
      return
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    setError('')
    const err = await signUp(email, password, username)
    if (err) setError(err)
    setLoading(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSignup()
  }

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, #b8dff0 0%, #cceaf7 60%, #a8d4e8 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '24px',
        padding: '40px 48px',
        width: '100%', maxWidth: '400px',
        display: 'flex', flexDirection: 'column',
        gap: '16px', fontFamily: 'sans-serif',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <div style={{ fontSize: '40px' }}>🌧</div>
          <h1 style={{ fontSize: '28px', color: '#1565c0', margin: '8px 0 4px' }}>
            Create Account
          </h1>
          <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>
            Join Math Rain and compete globally!
          </p>
        </div>

        {/* Username */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#444' }}>
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="coolplayer123"
            style={inputStyle}
          />
        </div>

        {/* Email */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#444' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="you@example.com"
            style={inputStyle}
          />
        </div>

        {/* Password */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#444' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="min 6 characters"
            style={inputStyle}
          />
        </div>

        {/* Error */}
        {error && (
          <p style={{
            color: '#c62828', fontSize: '13px',
            margin: 0, textAlign: 'center',
          }}>
            {error}
          </p>
        )}

        {/* Signup button */}
        <button
          onClick={handleSignup}
          disabled={loading}
          style={btnStyle}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        {/* Switch to login */}
        <p style={{ textAlign: 'center', fontSize: '14px', color: '#666', margin: 0 }}>
          Already have an account?{' '}
          <span
            onClick={onSwitchToLogin}
            style={{ color: '#1976d2', cursor: 'pointer', fontWeight: '600' }}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: '10px',
  border: '1.5px solid #ddd',
  fontSize: '15px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}

const btnStyle: React.CSSProperties = {
  padding: '12px',
  borderRadius: '12px',
  border: 'none',
  background: '#1976d2',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  marginTop: '4px',
}

export default SignupScreen