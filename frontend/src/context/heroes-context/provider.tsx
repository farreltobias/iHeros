'use client'

import { useState } from 'react'

import { Hero } from '@/src/types/characters'

import { HeroesContext } from './context'

type Props = React.PropsWithChildren<{
  heroes: Hero[]
}>

export const HeroesProvider: React.FC<Props> = ({
  children,
  heroes: initialHeroes,
}) => {
  const [heroes] = useState<Hero[]>(initialHeroes)

  return (
    <HeroesContext.Provider value={{ heroes }}>
      {children}
    </HeroesContext.Provider>
  )
}
