/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useState } from 'react'
import { renderToString } from 'react-dom/server'
import { Marker as MarketPrimitive, useMap } from 'react-leaflet'
import Image from 'next/image'

import dayjs from 'dayjs'
import L from 'leaflet'

import boom from '@/public/boom.gif'
import fire from '@/public/marker.webp'

import { Threat } from '@/src/types/characters'

import { ThreatPopup } from '../popups/threat'

type BattlingIconProps = {
  timeLeft?: number
}

const BattlingIcon: React.FC<BattlingIconProps> = ({ timeLeft }) => (
  <div className="relative h-12 w-12">
    <Image
      src={boom.src}
      className="object-contain, object-center"
      alt="boom"
      unoptimized
      fill
    />
    {timeLeft && (
      <span className="absolute -bottom-1/2 h-1/2 w-full p-1 text-center bg-black bg-opacity-50 text-white">
        {timeLeft}
      </span>
    )}
  </div>
)

type Props = {
  threat: Threat
}

export const ThreatMarker: React.FC<Props> = ({ threat }) => {
  const {
    location: { lat, lng },
    status,
    durationTime,
    battleStartedAt,
  } = threat

  const map = useMap()

  const [isWindowAccessible, setIsWindowAccessible] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number>()

  useEffect(() => {
    const interval = setInterval(() => {
      if (status !== 'BATTLING' || !durationTime || !battleStartedAt) {
        clearInterval(interval)
        return
      }

      const battleEndTime = dayjs(battleStartedAt).add(durationTime, 's')
      const time = dayjs(battleEndTime).diff(dayjs(), 'second')

      if (time <= 0 || isNaN(time)) {
        clearInterval(interval)
        setTimeLeft(0)
        return
      }

      setTimeLeft(time)
    }, 1000)

    return () => clearInterval(interval)
  }, [status])

  useEffect(() => {
    map.flyTo([lat, lng], 4)
    setIsWindowAccessible(true)

    return () => setIsWindowAccessible(false)
  }, [])

  const fireIcon = L.icon({
    iconUrl: fire.src,
    iconSize: [24 * 2, 36 * 2],
    iconAnchor: [24, 36],
    popupAnchor: [0, -30],
  })

  const boomIcon = L.divIcon({
    iconAnchor: [24, 36],
    popupAnchor: [0, -30],
    className: '',
    html: renderToString(<BattlingIcon timeLeft={timeLeft} />),
  })

  return (
    isWindowAccessible &&
    status !== 'RESOLVED' && (
      <MarketPrimitive
        position={[lat, lng]}
        icon={status === 'BATTLING' ? boomIcon : fireIcon}
      >
        <ThreatPopup {...threat} />
      </MarketPrimitive>
    )
  )
}
