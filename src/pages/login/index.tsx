import { useState } from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useAppStore } from '../../store'
import './index.scss'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const login = useAppStore((s) => s.login)
  const isLogin = useAppStore((s) => s.isLogin)

  const handleLogin = async () => {
    if (loading) return
    setLoading(true)
    try {
      // 微信小程序中调用 getUserProfile 获取用户信息
      // 这里模拟授权流程
      await login()
      Taro.showToast({ title: '登录成功', icon: 'success' })
      setTimeout(() => {
        Taro.switchTab ? Taro.switchTab({ url: '/pages/index/index' }) : Taro.redirectTo({ url: '/pages/index/index' })
      }, 500)
    } catch {
      Taro.showToast({ title: '登录失败', icon: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // 已登录直接跳转
  if (isLogin) {
    Taro.redirectTo({ url: '/pages/index/index' })
    return null
  }

  return (
    <View className='login-page'>
      <View className='login-bg'>
        <View className='bg-circle bg-circle-1' />
        <View className='bg-circle bg-circle-2' />
      </View>

      <View className='login-content'>
        <View className='logo-area'>
          <View className='logo-icon'>🏆</View>
          <Text className='app-title'>赛事积分</Text>
          <Text className='app-subtitle'>电竞赛事数据 · 实时更新</Text>
        </View>

        <View className='login-card'>
          <Text className='welcome-text'>欢迎使用</Text>
          <Text className='desc-text'>登录后可查看完整赛事数据与排行榜</Text>

          <Button
            className='wechat-login-btn'
            loading={loading}
            onClick={handleLogin}
          >
            <Text className='btn-icon'>💬</Text>
            <Text>{loading ? '登录中...' : '微信一键登录'}</Text>
          </Button>

          <View className='agreement'>
            <Text className='agree-text'>
              登录即表示同意 <Text className='link'>《用户协议》</Text> 和 <Text className='link'>《隐私政策》</Text>
            </Text>
          </View>
        </View>

        <View className='footer'>
          <Text className='footer-text'>© 2024 电竞赛事积分系统</Text>
        </View>
      </View>
    </View>
  )
}
