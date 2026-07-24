import { useState, useMemo } from 'react'
import SeasonSelector from '../components/SeasonSelector'
import TeamRankList from '../components/TeamRankList'
import PlayerRankList from '../components/PlayerRankList'
import TeamAvgRankList from '../components/TeamAvgRankList'
import TabBar from '../components/TabBar'
import { useGameStore } from '../store'
import type { TeamScoreRankItem, PlayerScoreRankItem, TeamAvgRankItem } from '../types'

type TabKey = 'teamTotal' | 'playerTotal' | 'teamAvg'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'teamTotal', label: '战队总分' },
  { key: 'playerTotal', label: '选手总分' },
  { key: 'teamAvg', label: '战队均分' },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabKey>('teamTotal')
  const [seasonId, setSeasonId] = useState<string>('s1')
  const seasons = useGameStore((s) => s.seasons)
  const teams = useGameStore((s) => s.teams)
  const players = useGameStore((s) => s.players)
  const playerScores = useGameStore((s) => s.playerScores)

  // 战队总分排行
  const teamTotalRanks = useMemo<TeamScoreRankItem[]>(() => {
    const seasonScores = playerScores.filter((ps) => ps.seasonId === seasonId)
    const teamMap = new Map<string, number>()
    seasonScores.forEach((ps) => {
      teamMap.set(ps.teamId, (teamMap.get(ps.teamId) || 0) + ps.totalScore)
    })

    return teams
      .map((t) => ({
        rank: 0,
        teamId: t.id,
        teamName: t.name,
        logo: t.logo,
        color: t.color,
        totalScore: teamMap.get(t.id) || 0,
        playerCount: t.playerIds.length,
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((item, idx) => ({ ...item, rank: idx + 1 }))
  }, [seasonId, teams, playerScores])

  // 选手总分排行
  const playerTotalRanks = useMemo<PlayerScoreRankItem[]>(() => {
    const seasonScores = playerScores.filter((ps) => ps.seasonId === seasonId)
    const playerMap = new Map<string, { totalScore: number; mvpCount: number; svpCount: number }>()

    seasonScores.forEach((ps) => {
      const existing = playerMap.get(ps.playerId) || { totalScore: 0, mvpCount: 0, svpCount: 0 }
      playerMap.set(ps.playerId, {
        totalScore: existing.totalScore + ps.totalScore,
        mvpCount: existing.mvpCount + (ps.isMVP ? 1 : 0),
        svpCount: existing.svpCount + (ps.isSVP ? 1 : 0),
      })
    })

    return seasonScores
      .map((ps) => {
        const agg = playerMap.get(ps.playerId)!
        const team = teams.find((t) => t.id === ps.teamId)
        const player = players.find((p) => p.id === ps.playerId)
        return {
          rank: 0,
          playerId: ps.playerId,
          playerName: ps.playerName,
          avatar: player?.avatar || '',
          role: ps.role,
          teamId: ps.teamId,
          teamName: team?.name || '',
          teamColor: team?.color || '#999',
          totalScore: agg.totalScore,
          mvpCount: agg.mvpCount,
          svpCount: agg.svpCount,
        }
      })
      .filter((item, idx, arr) => arr.findIndex((x) => x.playerId === item.playerId) === idx)
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((item, idx) => ({ ...item, rank: idx + 1 }))
  }, [seasonId, teams, playerScores])

  // 战队均分排行
  const teamAvgRanks = useMemo<TeamAvgRankItem[]>(() => {
    return teamTotalRanks
      .map((t) => ({
        ...t,
        avgScore: t.playerCount > 0 ? t.totalScore / t.playerCount : 0,
      }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .map((item, idx) => ({ ...item, rank: idx + 1 }))
  }, [teamTotalRanks])

  const currentSeason = seasons.find((s) => s.id === seasonId)

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部头部 */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-4 pt-12 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">🏆 赛事积分</h1>
          <SeasonSelector
            seasons={seasons}
            currentSeasonId={seasonId}
            onChange={setSeasonId}
          />
        </div>
        <p className="text-xs text-blue-100 opacity-80">
          {currentSeason?.name} · {currentSeason?.status === 'ongoing' ? '🔥 进行中' : '已结束'}
        </p>

        {/* 统计卡片 */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
            <div className="text-lg font-bold">{teams.length}</div>
            <div className="text-[11px] text-blue-100">参赛战队</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
            <div className="text-lg font-bold">
              {teams.reduce((sum, t) => sum + t.playerIds.length, 0)}
            </div>
            <div className="text-[11px] text-blue-100">参赛选手</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
            <div className="text-lg font-bold">{playerTotalRanks.length > 0 ? playerTotalRanks[0].totalScore.toLocaleString() : 0}</div>
            <div className="text-[11px] text-blue-100">最高积分</div>
          </div>
        </div>
      </div>

      {/* Tab 切换 */}
      <div className="px-4 -mt-3">
        <div className="bg-white rounded-xl p-1 flex shadow-sm">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 排行榜内容 */}
      <div className="px-4 mt-4">
        {activeTab === 'teamTotal' && <TeamRankList items={teamTotalRanks} />}
        {activeTab === 'playerTotal' && <PlayerRankList items={playerTotalRanks} />}
        {activeTab === 'teamAvg' && <TeamAvgRankList items={teamAvgRanks} />}
      </div>

      <TabBar active="home" />
    </div>
  )
}
