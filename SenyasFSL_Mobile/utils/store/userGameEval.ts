import { create } from "zustand";

type UserPoints = {
    score: number
    setScore: (value: number) => void
}

export const useUserPoints = create<UserPoints>((set)=>({
    score: 0,
    setScore: (value:number) => set({score: value}),
}))