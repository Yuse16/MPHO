'use client'

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

interface AuthContextValue {
  user: User | null
  loading: boolean
  error: string | null
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  error: null,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabaseRef = useRef<ReturnType<typeof createBrowserSupabaseClient> | null>(null)

  useEffect(() => {
    let active = true
    let unsubscribe = () => {}

    try {
      const supabase = supabaseRef.current ?? createBrowserSupabaseClient()
      supabaseRef.current = supabase

      void supabase.auth
        .getUser()
        .then(({ data: { user: currentUser } }) => {
          if (!active) return
          setUser(currentUser)
          setLoading(false)
        })
        .catch(() => {
          if (!active) return
          setUser(null)
          setError('No fue posible verificar la sesión.')
          setLoading(false)
        })

      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      })
      unsubscribe = () => data.subscription.unsubscribe()
    } catch {
      queueMicrotask(() => {
        if (!active) return
        setUser(null)
        setError('No fue posible verificar la sesión.')
        setLoading(false)
      })
    }

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  const signOut = async () => {
    setError(null)
    try {
      const supabase = supabaseRef.current ?? createBrowserSupabaseClient()
      supabaseRef.current = supabase
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) {
        setError('No fue posible cerrar la sesión. Intenta de nuevo.')
        return
      }
      setUser(null)
      router.replace('/login')
      router.refresh()
    } catch {
      setError('No fue posible cerrar la sesión. Intenta de nuevo.')
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
