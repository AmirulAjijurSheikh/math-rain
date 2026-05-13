import Cloud from './components/Cloud'

// Our cloud data - position and size for each cloud
const CLOUDS = [
  { id: 1, x: 5,  y: 60,  size: 'large'  as const },
  { id: 2, x: 25, y: 30,  size: 'medium' as const },
  { id: 3, x: 48, y: 80,  size: 'small'  as const },
  { id: 4, x: 65, y: 45,  size: 'large'  as const },
  { id: 5, x: 80, y: 25,  size: 'medium' as const },
]

function App() {
  return (
    // Game container - full screen sky background
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(180deg, #b8dff0 0%, #cceaf7 60%, #a8d4e8 100%)',
        overflow: 'hidden',
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

      {/* Ocean strip at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '80px',
          background: 'linear-gradient(180deg, #2196f3 0%, #1976d2 100%)',
        }}
      />

      {/* HUD - top bar with lives and score */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 20px',
        }}
      >
        {/* Lives */}
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
          ❤️❤️❤️
        </div>

        {/* Score */}
        <div
          style={{
            background: 'rgba(255,255,255,0.75)',
            borderRadius: '12px',
            padding: '6px 18px',
            fontSize: '18px',
            fontWeight: '600',
            color: '#333',
          }}
        >
          SCORE: 0
        </div>
      </div>

      {/* Answer input - center of screen */}
      <div
        style={{
          position: 'absolute',
          top: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <input
          type="number"
          placeholder="Type answer..."
          style={{
            padding: '8px 20px',
            borderRadius: '20px',
            border: '2px solid rgba(255,255,255,0.8)',
            background: 'rgba(255,255,255,0.9)',
            fontSize: '16px',
            textAlign: 'center',
            outline: 'none',
            width: '180px',
          }}
        />
      </div>

    </div>
  )
}

export default App