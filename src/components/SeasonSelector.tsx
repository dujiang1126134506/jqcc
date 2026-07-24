import { View, Text } from '@tarojs/components'
import type { Season } from '../types'
import './SeasonSelector.scss'

interface SeasonSelectorProps {
  seasons: Season[]
  currentSeasonId: string
  onChange: (id: string) => void
}

export default function SeasonSelector({ seasons, currentSeasonId, onChange }: SeasonSelectorProps) {
  return (
    <View className='season-selector'>
      {seasons.map((s) => {
        const active = s.id === currentSeasonId
        return (
          <View
            key={s.id}
            className={`season-item ${active ? 'active' : ''}`}
            onClick={() => onChange(s.id)}
          >
            <Text className='season-name'>{s.name}</Text>
            {s.isActive && <Text className='season-tag'>进行中</Text>}
          </View>
        )
      })}
    </View>
  )
}
