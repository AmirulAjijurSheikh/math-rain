interface DropProps {
  x: number
  y: number
  question: string
  isTargeted: boolean
  isPopping: boolean
  isShaking: boolean
}

function Drop({ x, y, question, isTargeted, isPopping, isShaking }: DropProps) {
  return (
    <div
      className={isPopping ? 'drop-pop' : isShaking ? 'drop-shake' : ''}
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        pointerEvents: 'none',
      }}
    >
      <svg
        width="72"
        height="90"
        viewBox="0 0 72 90"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={`g${isTargeted}`} cx="38%" cy="35%" r="60%">
            <stop offset="0%" stopColor={isTargeted ? '#90caf9' : '#64b5f6'} />
            <stop offset="100%" stopColor={isTargeted ? '#0d47a1' : '#1565c0'} />
          </radialGradient>
        </defs>
        <path
          d="M36 2 C36 2, 8 32, 8 55 C8 73, 20 86, 36 86 C52 86, 64 73, 64 55 C64 32, 36 2, 36 2 Z"
          fill={`url(#g${isTargeted})`}
        />
        <ellipse
          cx="26" cy="38" rx="7" ry="11"
          fill="rgba(255,255,255,0.25)"
          transform="rotate(-25 26 38)"
        />
        <text
          x="36" y="62"
          textAnchor="middle"
          fill="white"
          fontSize="11"
          fontWeight="700"
          fontFamily="sans-serif"
        >
          {question}
        </text>
      </svg>
    </div>
  )
}

export default Drop