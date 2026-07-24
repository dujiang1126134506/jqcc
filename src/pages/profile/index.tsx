import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useAppStore } from '../../store'
import TabBar from '../../components/TabBar'
import './index.scss'

const MENU_ITEMS = [
  { icon: '👤', label: '个人资料', desc: '完善个人信息' },
  { icon: '⭐', label: '我的收藏', desc: '收藏的战队和选手' },
  { icon: '📺', label: '观赛记录', desc: '观看过的比赛' },
  { icon: '🔔', label: '消息通知', desc: '赛事提醒与动态' },
  { icon: '⚙️', label: '设置', desc: '通用设置与偏好' },
  { icon: '❓', label: '帮助反馈', desc: '意见反馈与帮助中心' },
]

export default function Profile() {
  const user = useAppStore((s) => s.user)
  const isLogin = useAppStore((s) => s.isLogin)
  const logout = useAppStore((s) => s.logout)

  if (!isLogin || !user) {
    Taro.redirectTo({ url: '/pages/login/index' })
    return null
  }

  const handleLogout = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          logout()
          Taro.redirectTo({ url: '/pages/login/index' })
        }
      },
    })
  }

  return (
    <View className='profile-page'>
      <View className='header'>
        <View className='header-bg' />
        <View className='header-content'>
          <View className='user-info'>
            <View className='avatar'>
              <Text className='avatar-emoji'>👤</Text>
            </View>
            <View className='user-detail'>
              <Text className='nickname'>{user.nickName}</Text>
              <Text className='user-id'>ID: {user.id}</Text>
            </View>
            <View className='edit-btn'>
              <Text>编辑</Text>
            </View>
          </View>

          <View className='stats-row'>
            <View className='stat-item'>
              <Text className='stat-num'>2</Text>
              <Text className='stat-label'>关注战队</Text>
            </View>
            <View className='stat-divider' />
            <View className='stat-item'>
              <Text className='stat-num'>5</Text>
              <Text className='stat-label'>关注选手</Text>
            </View>
            <View className='stat-divider' />
            <View className='stat-item'>
              <Text className='stat-num'>12</Text>
              <Text className='stat-label'>观赛场次</Text>
            </View>
          </View>
        </View>
      </View>

      <View className='content-area'>
        <View className='menu-card'>
          {MENU_ITEMS.map((item, idx) => (
            <View key={item.label} className='menu-item' onClick={() => Taro.showToast({ title: item.label, icon: 'none' })}>
              <View className='menu-left'>
                <View className='menu-icon'>
                  <Text>{item.icon}</Text>
                </View>
                <View className='menu-text'>
                  <Text className='menu-label'>{item.label}</Text>
                  <Text className='menu-desc'>{item.desc}</Text>
                </View>
              </View>
              <Text className='menu-arrow'>›</Text>
              {idx < MENU_ITEMS.length - 1 && <View className='menu-divider' />}
            </View>
          ))}
        </View>

        <View className='logout-btn' onClick={handleLogout}>
          <Text>退出登录</Text>
        </View>

        <View className='version-info'>
          <Text>v1.0.0</Text>
        </View>
      </View>

      <TabBar />
    </View>
  )
}
