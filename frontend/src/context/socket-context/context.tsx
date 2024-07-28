import { createContext } from 'react'

import { Threat } from '@/src/types/threat'

export type SocketContextType = {
  threats: Threat[]
}

export const SocketContext = createContext<SocketContextType>({
  threats: [],
})
