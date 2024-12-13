'use client'

import { useEffect, useState } from 'react'

import { socket } from '@/src/socket'
import { socketEvents } from '@/src/socket/events'
import { Threat } from '@/src/types/characters'

import { ThreatsContext } from './context'

export const ThreatsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [threats, setThreats] = useState<Threat[]>([])

  useEffect(() => {
    socket.connect()

    return () => {
      socket.disconnect()
    }
  }, [])

  const { onThreat, onBattleStart, onBattleEnd } = socketEvents({
    setThreats,
    threats,
  })

  useEffect(() => {
    socket.on('threat', onThreat)

    return () => {
      socket.off('threat', onThreat)
    }
  }, [threats, onThreat])

  useEffect(() => {
    socket.on('battle.start', onBattleStart)
    return () => {
      socket.off('battle.start', onBattleStart)
    }
  }, [threats, onBattleStart])

  useEffect(() => {
    socket.on('battle.end', onBattleEnd)
    return () => {
      socket.off('battle.end', onBattleEnd)
    }
  }, [threats, onBattleEnd])

  return (
    <ThreatsContext.Provider value={{ threats }}>
      {children}
    </ThreatsContext.Provider>
  )
}
