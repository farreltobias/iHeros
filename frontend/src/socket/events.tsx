import { Threat } from '@/src/types/characters'

type Props = {
  setThreats: React.Dispatch<React.SetStateAction<Threat[]>>
  threats: Threat[]
}

export const socketEvents = ({ setThreats, threats }: Props) => {
  const onThreat = (data: Threat) => {
    setThreats([...threats, data])
  }

  const onBattleStart = (data: Threat) => {
    const index = threats.findIndex((threat) => threat.id === data.id)

    if (index === -1) {
      return
    }

    setThreats((state) => {
      state[index] = {
        ...data,
        monster: state[index].monster,
        danger: state[index].danger,
      }

      return [...state]
    })
  }

  const onBattleEnd = (data: Threat) => {
    const index = threats.findIndex((threat) => threat.id === data.id)

    if (index === -1) {
      return
    }

    setThreats((state) => {
      state[index] = {
        ...data,
        monster: state[index].monster,
        danger: state[index].danger,
      }

      return [...state]
    })
  }

  return {
    onThreat,
    onBattleStart,
    onBattleEnd,
  }
}
