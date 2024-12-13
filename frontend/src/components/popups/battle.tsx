'use client'

import React from 'react'
import { Popup } from 'react-leaflet'
import { Bangers } from 'next/font/google'
import Image from 'next/image'

import { Hero, Threat } from '@/src/types/characters'

const bangers = Bangers({
  display: 'swap',
  subsets: ['latin'],
  weight: ['400'],
})

type Props = {
  threat: Threat
  hero: Hero
}

export const BattlePopup: React.FC<Props> = ({
  threat: { monster, danger, durationTime },
  hero: { rank, ...hero },
}) => {
  return (
    <Popup minWidth={384}>
      <div className="!space-y-4">
        <div className="relative h-48 w-full">
          <Image
            src="https://i.pinimg.com/originals/d5/a7/cb/d5a7cb46e2f15a8fed10aaf1dd00965c.gif"
            className="object-contain, object-center [clip-path:polygon(0_0,100%_0,0_100%)]"
            alt={monster.name}
            fill
          />
          <Image
            src="https://media1.giphy.com/media/kz6iUkQuGZmN5HfB0t/giphy.gif"
            className="object-contain, object-center [clip-path:polygon(100%_100%,100%_0,0_100%);]"
            alt={monster.name}
            fill
          />
          <span
            className="absolute text-white text-4xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={bangers.style}
          >
            VS
          </span>
        </div>
        <div className="!space-y-4">
          <h1 className="flex justify-evenly items-center text-base font-bold capitalize">
            <div className="flex flex-col basis-1/2">
              <span>{monster.name}</span>
              <span className="text-xs text-gray-400">
                (Danger: {danger.name})
              </span>
            </div>
            <span>VS</span>
            <div className="flex flex-col basis-1/2 text-right">
              <span>{hero.name}</span>
              <span className="text-xs text-gray-400">(Rank: {rank.name})</span>
            </div>
          </h1>
          <p className="text-sm text-gray-400 !mb-0">
            Time Left: {durationTime} seconds
          </p>
        </div>
      </div>
    </Popup>
  )
}
