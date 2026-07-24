import { useState, useRef, useEffect } from 'react'
import type { Season } from '../types'

interface SeasonSelectorProps {
  seasons: Season[]
  currentSeasonId: string
  onChange: (id: string) => void
}

export default function SeasonSelector({ seasons, currentSeasonId, onChange }: SeasonSelectorProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const current = seasons.find((s) => s.id === currentSeasonId)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function handleSelect(id: string) {
    onChange(id)
    setOpen(false)
  }

  return (
    <div ref={menuRef} className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 bg-white/20 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm"
      >
        <span>{current?.name}</span>
        <span className={`text-xs transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg py-1 min-w-[120px] z-50 overflow-hidden">
          {seasons.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSelect(s.id)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                s.id === currentSeasonId
                  ? 'text-blue-600 font-medium bg-blue-50'
                  : 'text-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{s.name}</span>
                {s.status === 'ongoing' && (
                  <span className="text-[10px] text-red-500">进行中</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
