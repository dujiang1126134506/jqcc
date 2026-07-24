import { useState, useMemo } from 'react'
import SeasonSelector from '../components/SeasonSelector'
import TabBar from '../components/TabBar'
import { useGameStore } from '../store'
import type { MatchStage } from '../types'

const STAGE_FILTERS: { key: MatchStage | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'regular', label: '常规赛' },
  { key: 'revival', label: '复活赛' },
  { key: 'playoff', label: '季后赛' },
  { key: 'final', label: '总决赛' },
]

const STAGE_LABEL: Record<MatchStage, string> = {
  regular: '常规赛',
  revival: '复活赛',
  playoff: '季后赛',
  final: '总决赛',
}

export default function Schedule() {
  const [seasonId, setSeasonId] = useState<string>('s1')
  const [stageFilter, setStageFilter] = useState<MatchStage | 'all'>('all')

  const seasons = useGameStore((s) => s.seasons)
  const matches = useGameStore((s) => s.matches)
  const teams = useGameStore((s) => s.teams)

  const filteredMatches = useMemo(() => {
    let list = matches.filter((m) => m.seasonId === seasonId)
    if (stageFilter !== 'all') {
      list = list.filter((m) => m.stage === stageFilter)
    }
    // 按日期和轮次排序
    return list.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date)
      return a.round - b.round
    })
  }, [seasonId, stageFilter, matches])

  // 按日期分组
  const groupedByDate = useMemo(() => {
    const map = new Map<string, typeof filteredMatches>()
    filteredMatches.forEach((m) => {
      if (!map.has(m.date)) map.set(m.date, [])
      map.get(m.date)!.push(m)
    })
    return Array.from(map.entries())
  }, [filteredMatches])

  const getTeamInfo = (teamId: string) => {
    return teams.find((t) => t.id === teamId)
  }

  const currentSeason = seasons.find((s) => s.id === seasonId)

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部 */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">📅 赛程安排</h1>
          <SeasonSelector
            seasons={seasons}
            currentSeasonId={seasonId}
            onChange={setSeasonId}
          />
        </div>
        <p className="text-xs text-blue-100 opacity-80">
          {currentSeason?.name} · 共 {filteredMatches.length} 场比赛
        </p>
      </div>

      {/* 阶段筛选 */}
      <div className="px-4 -mt-3">
        <div className="bg-white rounded-xl p-1 flex gap-1 overflow-x-auto shadow-sm no-scrollbar">
          {STAGE_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setStageFilter(f.key)}
              className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                stageFilter === f.key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 赛程列表 */}
      <div className="px-4 mt-4 space-y-4">
        {groupedByDate.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            暂无赛程数据
          </div>
        )}

        {groupedByDate.map(([date, dayMatches]) => (
          <div key={date}>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400">{date}</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="space-y-2">
              {dayMatches.map((match) => {
                const teamA = getTeamInfo(match.teamAId)
                const teamB = getTeamInfo(match.teamBId)

                return (
                  <div
                    key={match.id}
                    className="bg-white rounded-xl p-4 shadow-sm"
                  >
                    {/* 顶部标签 */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">
                        {STAGE_LABEL[match.stage]} · 第{match.round}轮
                      </span>
                      {match.status === 'finished' ? (
                        <span className="text-[11px] text-gray-400">已结束</span>
                      ) : match.status === 'ongoing' ? (
                        <span className="text-[11px] text-red-500 font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                          进行中
                        </span>
                      ) : (
                        <span className="text-[11px] text-gray-400">未开始</span>
                      )}
                    </div>

                    {/* 对战双方 */}
                    <div className="flex items-center justify-between">
                      {/* 战队A */}
                      <div className="flex-1 flex flex-col items-center">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-xl mb-1 shadow-sm"
                          style={{ background: teamA?.color + '20' }}
                        >
                          {teamA?.logo}
                        </div>
                        <span className="text-sm font-medium text-gray-900 text-center">
                          {teamA?.name}
                        </span>
                      </div>

                      {/* VS / 比分 */}
                      <div className="px-4">
                        {match.status === 'upcoming' ? (
                          <span className="text-xs text-gray-400 font-bold tracking-wider">
                            VS
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-lg font-bold ${
                                match.scoreA > match.scoreB
                                  ? 'text-blue-600'
                                  : 'text-gray-400'
                              }`}
                            >
                              {match.scoreA}
                            </span>
                            <span className="text-xs text-gray-300">:</span>
                            <span
                              className={`text-lg font-bold ${
                                match.scoreB > match.scoreA
                                  ? 'text-blue-600'
                                  : 'text-gray-400'
                              }`}
                            >
                              {match.scoreB}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* 战队B */}
                      <div className="flex-1 flex flex-col items-center">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-xl mb-1 shadow-sm"
                          style={{ background: teamB?.color + '20' }}
                        >
                          {teamB?.logo}
                        </div>
                        <span className="text-sm font-medium text-gray-900 text-center">
                          {teamB?.name}
                        </span>
                      </div>
                    </div>

                    {/* 比赛时间和BO信息 */}
                    <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400">
                      <span>⏰ {match.time || '待定'}</span>
                      <span>BO{match.boFormat}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <TabBar active="schedule" />
    </div>
  )
}
