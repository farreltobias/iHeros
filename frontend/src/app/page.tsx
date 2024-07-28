'use client'

import { useContext, useEffect } from 'react'
import dynamic from 'next/dynamic'

import { Glitch } from '@/src/components/glitch'
import { SocketContext } from '@/src/context/socket-context/context'

const Map = dynamic(
  () => import('../components/map').then((module) => module.Map),
  { ssr: false },
)

const Marker = dynamic(
  () => import('../components/marker').then((module) => module.Marker),
  { ssr: false },
)

export default function Home() {
  const { threats } = useContext(SocketContext)

  useEffect(() => {
    console.log(threats)
  }, [threats])

  return (
    <main className="relative">
      <Glitch />
      <Map>
        {threats.map((threat) => (
          <Marker key={threat.id} {...threat} />
        ))}
      </Map>
    </main>
  )
}
