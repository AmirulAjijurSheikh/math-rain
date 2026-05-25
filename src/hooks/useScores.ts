import { useState } from 'react'
import { supabase } from '../lib/supabase'

export function useScores() {
  const [saving, setSaving] = useState(false)

  async function saveScore(
    userId: string,
    username: string,
    score: number,
    difficulty: string
  ): Promise<boolean> {
    setSaving(true)
    let isNewBest = false
    try {
      const { data: existing } = await supabase
        .from('scores')
        .select('score')
        .eq('user_id', userId)
        .eq('difficulty', difficulty)
        .single()

      if (!existing || score > existing.score) {
        await supabase.from('scores').upsert({
          user_id: userId,
          username,
          score,
          difficulty,
        }, {
          onConflict: 'user_id,difficulty'
        })
        isNewBest = true
      }
    } catch (err) {
      console.error('Error saving score:', err)
    }
    setSaving(false)
    return isNewBest
  }

  return { saveScore, saving }
}