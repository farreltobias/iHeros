import { createContext } from 'react'

import { Hero } from '@/src/types/characters'

export type HeroesContextType = {
  heroes: Hero[]
}

export const HeroesContext = createContext<HeroesContextType>({
  heroes: [],
})
