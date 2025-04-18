'use client'

import { create } from "zustand"

type SettingsState = {
    territory: string
    setTerritory: (territory: string) => void
}

export const useSettingsStore = create<SettingsState>((set) => {
    const savedTerritory = typeof window !== "undefined" ? localStorage.getItem("territory") : null

    return {
        territory: savedTerritory || "WS",
        setTerritory: (territory: string) => {
            localStorage.setItem('territory', territory)
            set({ territory })
        },
    }
})