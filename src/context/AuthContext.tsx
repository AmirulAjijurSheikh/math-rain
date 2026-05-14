import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  username: string | null
  loading: boolean
  signUp: (email: string, password: string, username: string) => Promise<string | null>
  signIn: (email: string, password: string) => Promise<string | null>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchUsername(session.user.id)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) fetchUsername(session.user.id)
        else setUsername(null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function fetchUsername(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single()
    if (data) setUsername(data.username)
  }

  async function signUp(
    email: string,
    password: string,
    username: string
  ): Promise<string | null> {
    // Check username is not taken
    const { data: existing } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single()

    if (existing) return 'Username already taken'

    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return error.message
    if (!data.user) return 'Signup failed'

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ id: data.user.id, username })

    if (profileError) return profileError.message

    setUsername(username)
    return null
  }

  async function signIn(
    email: string,
    password: string
  ): Promise<string | null> {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) return error.message
    return null
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUsername(null)
  }

  return (
    <AuthContext.Provider value={{
      user, username, loading,
      signUp, signIn, signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}