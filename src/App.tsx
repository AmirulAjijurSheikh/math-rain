// import { useState } from 'react'
import { useState, useEffect } from 'react'


// This function generates a random math question
function generateQuestion() {
  const a = Math.floor(Math.random() * 10) + 1
  const b = Math.floor(Math.random() * 10) + 1
  return {
    question: `${a} + ${b}`,
    answer: a + b
  }
}

function App() {
  // useState stores values that change on screen
  const [current, setCurrent] = useState(generateQuestion())
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState('')
  const [score, setScore] = useState(0)

  useEffect(() => {
  console.log('Score changed to:', score)
}, [score])

  

  function handleAnswer() {
    // Convert input string to a number and check it
    if (parseInt(input) === current.answer) {
      setFeedback('✅ Correct!')
      setScore(score + 1)
    } else {
      setFeedback(`❌ Wrong! The answer was ${current.answer}`)
    }

    // Wait 1 second then load next question
    setTimeout(() => {
      setCurrent(generateQuestion())
      setInput('')
      setFeedback('')
    }, 1000)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    // Submit when player presses Enter
    if (e.key === 'Enter') {
      handleAnswer()
    }
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Math Practice</h1>
      <p>Score: {score}</p>

      <h2 style={{ fontSize: '48px' }}>{current.question} = ?</h2>

      <input
        type="number"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Your answer..."
        style={{ fontSize: '24px', padding: '8px', width: '200px' }}
      />

      <br /><br />

      <button
        onClick={handleAnswer}
        style={{ fontSize: '18px', padding: '8px 24px' }}
      >
        Submit
      </button>

      <p style={{ fontSize: '24px', marginTop: '20px' }}>{feedback}</p>
    </div>
  )
}

export default App