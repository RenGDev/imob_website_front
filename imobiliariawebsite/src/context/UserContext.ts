import { UserItf } from '@/utils/types/UserItf'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthState = {
  user: UserItf | null
  token: string | null
  isLoading: boolean
  error: string | null
}

type AuthActions = {
  signIn: (userData: UserItf, token: string) => void
  Logged: (userData: UserItf) => void
  signOut: () => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      
      signIn: (userData, token) => set({ 
        user: userData, 
        token,
        error: null 
      }),
      
      Logged: (userData) => set({
        user: userData,
        error: null
      }),

      signOut: () => set({ 
        user: null, 
        token: null,
        error: null 
      }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error })
    }),
    {
      name: 'auth-storage', // Nome para o localStorage
    }
  )
)