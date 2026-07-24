import { useNavigate } from 'react-router-dom'
import TabBar from '../components/TabBar'
import { useGameStore } from '../store'

const MENU_ITEMS = [
  { icon: '👤', label: '个人资料', desc: '修改头像和昵称' },
  { icon: '⭐', label: '我的收藏', desc: '关注的战队和选手' },
  { icon: '📊', label: '观赛记录', desc: '查看历史观赛' },
  { icon: '🔔', label: '消息通知', desc: '赛事提醒' },
  { icon: '⚙️', label: '设置', desc: '账号与隐私设置' },
  { icon: '❓', label: '帮助与反馈', desc: '联系客服' },
]

export default function Profile() {
  const navigate = useNavigate()
  const user = useGameStore((s) => s.user)
  const clearUser = useGameStore((s) => s.clearUser)

  const handleLogout = () => {
    clearUser()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 头部用户信息 */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-4 pt-12 pb-16">
        <h1 className="text-xl font-bold mb-6">个人中心</h1>

        <div className="flex items-center gap-4">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="头像"
              className="w-16 h-16 rounded-full border-2 border-white/30 shadow-lg"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl">
              👤
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-lg font-bold truncate">
              {user?.nickname || '游客'}
            </div>
            <div className="text-xs text-blue-100 opacity-80 mt-0.5">
              ID: {user?.id || '--'}
            </div>
          </div>
          <button className="text-xs bg-white/20 px-3 py-1.5 rounded-full backdrop-blur">
            编辑资料
          </button>
        </div>
      </div>

      {/* 数据卡片 */}
      <div className="px-4 -mt-8">
        <div className="bg-white rounded-xl p-4 shadow-sm grid grid-cols-3">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">12</div>
            <div className="text-xs text-gray-400">关注战队</div>
          </div>
          <div className="text-center border-x border-gray-100">
            <div className="text-lg font-bold text-gray-900">28</div>
            <div className="text-xs text-gray-400">关注选手</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">56</div>
            <div className="text-xs text-gray-400">观赛场次</div>
          </div>
        </div>
      </div>

      {/* 菜单列表 */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          {MENU_ITEMS.map((item, idx) => (
            <div
              key={item.label}
              className={`flex items-center px-4 py-3.5 active:bg-gray-50 transition-colors cursor-pointer ${
                idx !== MENU_ITEMS.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">{item.label}</div>
                <div className="text-xs text-gray-400">{item.desc}</div>
              </div>
              <span className="text-gray-300">›</span>
            </div>
          ))}
        </div>
      </div>

      {/* 退出登录 */}
      <div className="px-4 mt-4">
        <button
          onClick={handleLogout}
          className="w-full bg-white text-red-500 font-medium py-3.5 rounded-xl shadow-sm active:bg-gray-50 transition-colors"
        >
          退出登录
        </button>
      </div>

      {/* 版本信息 */}
      <div className="text-center text-xs text-gray-300 mt-8">
        赛事积分 v1.0.0
      </div>

      <TabBar active="profile" />
    </div>
  )
}
