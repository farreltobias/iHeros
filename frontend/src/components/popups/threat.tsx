'use client'

import React from 'react'
import { Popup } from 'react-leaflet'
import Image from 'next/image'

import { Danger, Monster } from '@/src/types/characters'

type Props = {
  monster: Monster
  danger: Danger
}

export const ThreatPopup: React.FC<Props> = ({ monster, danger }) => {
  return (
    <Popup minWidth={384}>
      <div className="!space-y-1">
        <div className="relative h-48 w-full">
          <Image
            src="https://i.pinimg.com/originals/d5/a7/cb/d5a7cb46e2f15a8fed10aaf1dd00965c.gif"
            className="object-contain, object-center"
            alt={monster.name}
            fill
          />
        </div>
        <h1 className="tracking-[0.1875rem] text-base font-bold capitalize">
          {monster.name}
        </h1>
        <h2 className="text-base font-bold capitalize">
          Danger Level: {danger.name}
        </h2>
        <p className="text-sm text-gray-400 !mb-0">{monster.description}</p>
      </div>
    </Popup>
  )
}
