import { View, Text } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import './TabBar.scss'

interface TabItem {
  key: string
  text: string
  icon: string
  path: string
}

const tabs: TabItem[] = [
  { key: 'home', text: '首页', icon: '🏆', path: '/pages/index/index' },
  { key: 'schedule', text: '赛程', icon: '📅', path: '/pages/schedule/index' },
  { key: 'profile', text: '我的', icon: '👤', path: '/pages/profile/index' },
]

export default function TabBar() {
  const router = useRouter()
  const currentPath = '/' + router.path

  const handleTabClick = (path: string) => {
    if (currentPath === path) return
    Taro.redirectTo({ url: path })
  }

  return (
    <View className='tab-bar'>
      {tabs.map((tab) => {
        const active = currentPath === tab.path
        return (
          <View
            key={tab.key}
            className={`tab-item ${active ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.path)}
          >
            <Text className='tab-icon'>{tab.icon}</Text>
            <Text className='tab-text'>{tab.text}</Text>
          </View>
        )
      })}
    </View>
  )
}
