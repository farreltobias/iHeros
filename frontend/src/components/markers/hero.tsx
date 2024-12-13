'use client'

import { useEffect, useState } from 'react'
import { Marker as MarketPrimitive, Popup, useMap } from 'react-leaflet'

// import Image from 'next/image'
import L from 'leaflet'

import boom from '@/public/boom.gif'
import fire from '@/public/marker.webp'

import { Hero } from '@/src/types/characters'

type Props = Hero

export const HeroMarker: React.FC<Props> = ({
  location: { lat, lng },
  // name,
  // photoUrl,
  // rank,
  status,
}) => {
  const map = useMap()
  map.flyTo([lat, lng], 4)

  const [isWindowAccessible, setIsWindowAccessible] = useState(false)

  const fireIcon = L.icon({
    iconUrl: fire.src,
    iconSize: [24 * 2, 36 * 2],
    iconAnchor: [24, 36],
    popupAnchor: [0, -30],
  })

  const boomIcon = L.icon({
    iconUrl: boom.src,
    iconSize: [24 * 2, 24 * 2],
    iconAnchor: [24, 36],
    popupAnchor: [0, -30],
  })

  useEffect(() => {
    setIsWindowAccessible(true)
  }, [])

  return (
    isWindowAccessible &&
    status !== 'UNASSIGNED' && (
      <MarketPrimitive
        position={[lat, lng]}
        icon={status === 'BATTLING' ? boomIcon : fireIcon}
      >
        <Popup minWidth={384}>
          <div className="!space-y-1">
            {/* <div className="relative h-48 w-full"> */}
            {/*  <Image */}
            {/*    src="https://i.pinimg.com/originals/d5/a7/cb/d5a7cb46e2f15a8fed10aaf1dd00965c.gif" */}
            {/*    className="object-contain, object-center" */}
            {/*    alt={monster.name} */}
            {/*    fill */}
            {/*  /> */}
            {/* </div> */}
            {/* <h1 className="tracking-[0.1875rem] text-base font-bold capitalize"> */}
            {/*  {monster.name} */}
            {/* </h1> */}
            {/* <h2 className="text-base font-bold capitalize"> */}
            {/*  Danger Level: {danger.name} */}
            {/* </h2> */}
            {/* <p className="text-sm text-gray-400 !mb-0">{monster.description}</p> */}
          </div>
        </Popup>
      </MarketPrimitive>
    )
  )
}
