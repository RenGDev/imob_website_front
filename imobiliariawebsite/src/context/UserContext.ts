import { UserItf } from '@/utils/types/UserItf'
import { create } from 'zustand' 

type UserStore = {
    user: UserItf
    signInUser: (loggedUser: UserItf) => void
    signOutUser: () => void
}

export const useUserStore = create<UserStore>((set) => ({
    user: {} as UserItf,
    signInUser: (loggedUser) => set({user: loggedUser}),
    signOutUser: () => set({user: {} as UserItf})
}))