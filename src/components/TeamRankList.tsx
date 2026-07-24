import type { TeamScoreRankItem } from '../types'

interface TeamRankListProps {
  items: TeamScoreRankItem[]
  scoreLabel?: string
  showPlayerCount?: boolean
}

function getRankStyle(rank: number) {
  if (rank === 1) return 'bg-gradient-to-br from-yellow-400 to-orange-400 text-white'
  if (rank === 2) return 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
  if (rank === 3) return 'bg-gradient-to-br from-orange-300 to-amber-500 text-white'
  return 'bg-gray-100 text-gray-600'
}

export default function TeamRankList({
  items,
  scoreLabel = '战队总分',
  showPlayerCount = false,
}: TeamRankListProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <div className="flex items-center px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
        <span className="w-8">排名</span>
        <span className="flex-1">战队</span>
        <span className="w-20 text-right">{scoreLabel}</span>
      </div>

      <div className="divide-y divide-gray-50">
        {items.map((item) => (
          <div
            key={item.teamId}
            className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <div className="w-8">
              <span
                className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${getRankStyle(item.rank)}`}
              >
                {item.rank}
              </span>
            </div>

            <div className="flex-1 flex items-center gap-3 min-w-0">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 shadow-sm"
                style={{ background: item.color + '20' }}
              >
                {item.logo}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {item.teamName}
                </div>
                {showPlayerCount && (
                  <div className="text-xs text-gray-400">
                    {item.playerCount} 名选手
                  </div>
                )}
              </div>
            </div>

            <div className="w-20 text-right">
              <span
                className="text-base font-bold"
                style={{ color: item.color }}
              >
                {item.totalScore.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
