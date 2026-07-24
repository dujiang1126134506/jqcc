import { create } from 'zustand'
import Taro from '@tarojs/taro'
import type { UserInfo } from '../types'
import { MOCK_USER } from '../data/mockData'

interface AppState {
  user: UserInfo | null
  isLogin: boolean
  login: () => Promise<void>
  logout: () => void
}

const STORAGE_KEY = 'taro_score_user'

// 从本地存储读取用户信息
function loadUser(): UserInfo | null {
  try {
    const data = Taro.getStorageSync(STORAGE_KEY)
    return data ? (data as UserInfo) : null
  } catch {
    return null
  }
}

export const useAppStore = create<AppState>((set) => ({
  user: loadUser(),
  isLogin: !!loadUser(),

  login: async () => {
    // 模拟微信授权登录流程
    try {
      // 真实小程序中这里调用 Taro.getUserProfile 或 wx.login + code 换 session
      await new Promise((resolve) => setTimeout(resolve, 800))
      const user: UserInfo = MOCK_USER
      Taro.setStorageSync(STORAGE_KEY, user)
      set({ user, isLogin: true })
    } catch (err) {
      console.error('登录失败', err)
      throw err
    }
  },

  logout: () => {
    Taro.removeStorageSync(STORAGE_KEY)
    set({ user: null, isLogin: false })
  },
}))
