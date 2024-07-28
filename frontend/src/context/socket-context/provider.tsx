'use client'

import { useEffect, useState } from 'react'

import { socket } from '@/src/socket'
import { socketEvents } from '@/src/socket/events'
import { Threat } from '@/src/types/threat'

import { SocketContext } from './context'

export const SocketProvider: React.FC<React.PropsWithChildren> = ({
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
    <SocketContext.Provider value={{ threats }}>
      {children}
    </SocketContext.Provider>
  )
}
