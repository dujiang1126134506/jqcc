import type { PlayerScoreRankItem } from '../types'

interface PlayerRankListProps {
  items: PlayerScoreRankItem[]
}

function getRankStyle(rank: number) {
  if (rank === 1) return 'bg-gradient-to-br from-yellow-400 to-orange-400 text-white'
  if (rank === 2) return 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
  if (rank === 3) return 'bg-gradient-to-br from-orange-300 to-amber-500 text-white'
  return 'bg-gray-100 text-gray-600'
}

export default function PlayerRankList({ items }: PlayerRankListProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <div className="flex items-center px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
        <span className="w-8">排名</span>
        <span className="flex-1">选手</span>
        <span className="w-20 text-right">总分</span>
      </div>

      <div className="divide-y divide-gray-50">
        {items.map((item) => (
          <div
            key={item.playerId}
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
                className="w-10 h-10 rounded-full flex-shrink-0 shadow-sm"
                style={{ background: item.avatar }}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {item.playerName}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 flex-shrink-0">
                    {item.role}
                  </span>
                </div>
                <div
                  className="text-xs font-medium"
                  style={{ color: item.teamColor }}
                >
                  {item.teamName}
                </div>
              </div>
            </div>

            <div className="w-20 text-right">
              <span className="text-base font-bold text-gray-900">
                {item.totalScore.toLocaleString()}
              </span>
              {item.mvpCount > 0 && (
                <div className="text-[10px] text-orange-500">
                  MVP ×{item.mvpCount}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
