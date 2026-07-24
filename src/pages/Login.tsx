import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store'
import { defaultUser } from '../store'

export default function Login() {
  const navigate = useNavigate()
  const setUser = useGameStore((s) => s.setUser)

  const handleWxLogin = () => {
    // 模拟微信授权登录：自动获取昵称、头像
    setUser(defaultUser)
    navigate('/home', { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-blue-50 to-white">
      {/* Logo */}
      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg">
        <span className="text-5xl">🏆</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">电竞赛事积分</h1>
      <p className="text-sm text-gray-500 mb-16">查看战队排行 · 选手数据 · 赛程安排</p>

      {/* 微信授权登录按钮 */}
      <button
        onClick={handleWxLogin}
        className="w-full max-w-sm bg-[#07C160] text-white font-medium py-3.5 rounded-full flex items-center justify-center gap-2 shadow-md hover:bg-[#06AD56] active:scale-98 transition-all"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-3.022-6.122-7.062-6.122zm-2.036 2.93c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z" />
        </svg>
        微信一键登录
      </button>

      <p className="text-xs text-gray-400 mt-6">
        登录即表示同意《用户协议》和《隐私政策》
      </p>

      {/* 底部装饰 */}
      <div className="mt-auto flex gap-6 text-gray-300">
        <span className="text-3xl">🎮</span>
        <span className="text-3xl">⚔️</span>
        <span className="text-3xl">🎯</span>
      </div>
    </div>
  )
}
