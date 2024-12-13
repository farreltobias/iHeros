'use client'

import { useContext, useEffect } from 'react'
import dynamic from 'next/dynamic'

import { Glitch } from '@/src/components/glitch'
import { ThreatsContext } from '@/src/context/threats-context/context'

// import { HeroesContext } from '../context/heroes-context/context'

const Map = dynamic(
  () => import('../components/map').then((module) => module.Map),
  { ssr: false },
)

const ThreatMarker = dynamic(
  () =>
    import('../components/markers/threat').then(
      (module) => module.ThreatMarker,
    ),
  { ssr: false },
)

export default function Home() {
  const { threats } = useContext(ThreatsContext)
  // const { heroes } = useContext(HeroesContext)

  useEffect(() => {
    console.log(threats)
  }, [threats])

  return (
    <main className="relative">
      <Glitch />
      <Map>
        {threats.map((threat) => (
          <ThreatMarker key={threat.id} threat={threat} />
        ))}
      </Map>
    </main>
  )
}
