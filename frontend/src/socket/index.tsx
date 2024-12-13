import io from 'socket.io-client'

import { envClient } from '../env/client'

export const socket = io(envClient.NEXT_PUBLIC_SOCKET_URL, {
  autoConnect: false,
})
