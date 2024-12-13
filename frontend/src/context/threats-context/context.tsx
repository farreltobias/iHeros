import { createContext } from 'react'

import { Threat } from '@/src/types/characters'

export type ThreatsContextType = {
  threats: Threat[]
}

export const ThreatsContext = createContext<ThreatsContextType>({
  threats: [],
})
