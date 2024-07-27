'use client'

import dynamic from 'next/dynamic'

import { Glitch } from '@/components/glitch'

const Map = dynamic(
  () => import('../components/map').then((module) => module.Map),
  { ssr: false },
)

export default function Home() {
  return (
    <main className="relative">
      <Glitch />
      <Map />
    </main>
  )
}
