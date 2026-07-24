import { Link, useLocation } from 'react-router-dom'

interface TabItem {
  path: string
  label: string
  icon: string
}

interface TabBarProps {
  active?: 'home' | 'schedule' | 'profile'
}

const tabs: TabItem[] = [
  { path: '/home', label: '首页', icon: '🏠' },
  { path: '/schedule', label: '赛程', icon: '📅' },
  { path: '/profile', label: '我的', icon: '👤' },
]

export default function TabBar({ active }: TabBarProps) {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40 border-t border-gray-200 bg-white safe-bottom">
      <div className="flex">
        {tabs.map((tab) => {
          const isActive = active
            ? (active === 'home' && tab.path === '/home') ||
              (active === 'schedule' && tab.path === '/schedule') ||
              (active === 'profile' && tab.path === '/profile')
            : location.pathname.startsWith(tab.path) ||
              (tab.path === '/home' && location.pathname === '/')
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className="flex-1 flex flex-col items-center justify-center py-2 text-xs transition-colors"
              style={{ color: isActive ? '#07c160' : '#888' }}
            >
              <span className="text-xl mb-0.5">{tab.icon}</span>
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
