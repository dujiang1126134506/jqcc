import { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useAppStore } from '../../store'
import {
  MOCK_TEAMS,
  MOCK_PLAYERS,
  MOCK_SEASONS,
  MOCK_PLAYER_SCORES,
} from '../../data/mockData'
import { calcTotalScore } from '../../types'
import SeasonSelector from '../../components/SeasonSelector'
import TabBar from '../../components/TabBar'
import './index.scss'

type TabKey = 'teamTotal' | 'playerTotal' | 'teamAvg'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'teamTotal', label: '战队总分榜' },
  { key: 'playerTotal', label: '选手总分榜' },
  { key: 'teamAvg', label: '战队均分榜' },
]

interface TeamRankItem {
  teamId: string
  teamName: string
  logo: string
  themeColor: string
  totalScore: number
  playerCount: number
}

interface PlayerRankItem {
  playerId: string
  playerName: string
  avatar: string
  teamId: string
  teamName: string
  position: string
  totalScore: number
  mvpCount: number
}

export default function Index() {
  const isLogin = useAppStore((s) => s.isLogin)
  const [currentSeasonId, setCurrentSeasonId] = useState(MOCK_SEASONS.find((s) => s.isActive)?.id || MOCK_SEASONS[0].id)
  const [activeTab, setActiveTab] = useState<TabKey>('teamTotal')

  // 未登录跳转
  if (!isLogin) {
    Taro.redirectTo({ url: '/pages/login/index' })
    return null
  }

  // 赛季内的选手得分
  const seasonScores = useMemo(
    () => MOCK_PLAYER_SCORES.filter((s) => s.seasonId === currentSeasonId),
    [currentSeasonId],
  )

  // 战队总分榜数据
  const teamTotalRanks = useMemo<TeamRankItem[]>(() => {
    const teamScores = new Map<string, number>()
    const teamPlayerCounts = new Map<string, Set<string>>()

    seasonScores.forEach((score) => {
      const player = MOCK_PLAYERS.find((p) => p.id === score.playerId)
      if (!player) return
      const current = teamScores.get(player.teamId) || 0
      teamScores.set(player.teamId, current + calcTotalScore(score))

      if (!teamPlayerCounts.has(player.teamId)) {
        teamPlayerCounts.set(player.teamId, new Set())
      }
      teamPlayerCounts.get(player.teamId)!.add(player.id)
    })

    return MOCK_TEAMS.map((team) => ({
      teamId: team.id,
      teamName: team.name,
      logo: team.logo,
      themeColor: team.themeColor,
      totalScore: teamScores.get(team.id) || 0,
      playerCount: teamPlayerCounts.get(team.id)?.size || 0,
    }))
      .sort((a, b) => b.totalScore - a.totalScore)
  }, [seasonScores])

  // 选手总分榜数据
  const playerTotalRanks = useMemo<PlayerRankItem[]>(() => {
    const playerScoreMap = new Map<string, number>()
    const playerMvpMap = new Map<string, number>()

    seasonScores.forEach((score) => {
      const current = playerScoreMap.get(score.playerId) || 0
      playerScoreMap.set(score.playerId, current + calcTotalScore(score))
      if (score.isMVP) {
        playerMvpMap.set(score.playerId, (playerMvpMap.get(score.playerId) || 0) + 1)
      }
    })

    return MOCK_PLAYERS
      .filter((p) => playerScoreMap.has(p.id))
      .map((player) => {
        const team = MOCK_TEAMS.find((t) => t.id === player.teamId)!
        return {
          playerId: player.id,
          playerName: player.name,
          avatar: player.avatar,
          teamId: player.teamId,
          teamName: team.name,
          position: player.position,
          totalScore: playerScoreMap.get(player.id) || 0,
          mvpCount: playerMvpMap.get(player.id) || 0,
        }
      })
      .sort((a, b) => b.totalScore - a.totalScore)
  }, [seasonScores])

  // 战队均分榜数据
  const teamAvgRanks = useMemo<TeamRankItem[]>(() => {
    return teamTotalRanks
      .map((item) => ({
        ...item,
        totalScore: item.playerCount > 0 ? Math.round((item.totalScore / item.playerCount) * 10) / 10 : 0,
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
  }, [teamTotalRanks])

  // 统计数据
  const stats = useMemo(() => {
    const maxScore = playerTotalRanks[0]?.totalScore || 0
    return {
      teamCount: MOCK_TEAMS.length,
      playerCount: MOCK_PLAYERS.filter((p) =>
        seasonScores.some((s) => s.playerId === p.id),
      ).length,
      maxScore,
    }
  }, [playerTotalRanks, seasonScores])

  const renderRank = (item: TeamRankItem | PlayerRankItem, idx: number, type: 'team' | 'player') => {
    const isTop3 = idx < 3
    const rankBg = idx === 0 ? '#fbbf24' : idx === 1 ? '#94a3b8' : idx === 2 ? '#d97706' : '#e5e7eb'
    const rankColor = idx < 3 ? '#fff' : '#666'

    return (
      <View key={type === 'team' ? (item as TeamRankItem).teamId : (item as PlayerRankItem).playerId} className='rank-item'>
        <View className='rank-num' style={{ background: rankBg, color: rankColor }}>{idx + 1}</View>

        {type === 'team' ? (
          <>
            <View
              className='rank-avatar team-avatar'
              style={{ background: (item as TeamRankItem).themeColor + '22' }}
            >
              <Text className='avatar-text'>{(item as TeamRankItem).logo}</Text>
            </View>
            <View className='rank-info'>
              <Text className='rank-name'>{(item as TeamRankItem).teamName}</Text>
              <Text className='rank-sub'>{(item as TeamRankItem).playerCount} 名选手</Text>
            </View>
          </>
        ) : (
          <>
            <View className='rank-avatar player-avatar' style={{ background: (item as PlayerRankItem).avatar }}>
              <Text className='avatar-initials'>{(item as PlayerRankItem).playerName[0]}</Text>
            </View>
            <View className='rank-info'>
              <Text className='rank-name'>{(item as PlayerRankItem).playerName}</Text>
              <Text className='rank-sub'>
                {(item as PlayerRankItem).teamName} · {(item as PlayerRankItem).position}
                {(item as PlayerRankItem).mvpCount > 0 && <Text className='mvp-tag'> 🏆{(item as PlayerRankItem).mvpCount}次MVP</Text>}
              </Text>
            </View>
          </>
        )}

        <View className='rank-score'>
          <Text className='score-num'>{(item as any).totalScore}</Text>
          <Text className='score-label'>分</Text>
        </View>
      </View>
    )
  }

  return (
    <View className='home-page'>
      <View className='header'>
        <View className='header-bg' />
        <View className='header-content'>
          <Text className='header-title'>🏆 赛事排行榜</Text>
          <SeasonSelector
            seasons={MOCK_SEASONS}
            currentSeasonId={currentSeasonId}
            onChange={setCurrentSeasonId}
          />

          <View className='stats-row'>
            <View className='stat-card'>
              <Text className='stat-num'>{stats.teamCount}</Text>
              <Text className='stat-label'>参赛战队</Text>
            </View>
            <View className='stat-card'>
              <Text className='stat-num'>{stats.playerCount}</Text>
              <Text className='stat-label'>参赛选手</Text>
            </View>
            <View className='stat-card'>
              <Text className='stat-num'>{stats.maxScore}</Text>
              <Text className='stat-label'>最高积分</Text>
            </View>
          </View>
        </View>
      </View>

      <View className='content-area'>
        <View className='tab-bar'>
          {TABS.map((tab) => (
            <View
              key={tab.key}
              className={`tab-item ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <Text>{tab.label}</Text>
              {activeTab === tab.key && <View className='tab-indicator' />}
            </View>
          ))}
        </View>

        <ScrollView className='rank-list' scrollY>
          {activeTab === 'teamTotal' && teamTotalRanks.map((item, idx) => renderRank(item, idx, 'team'))}
          {activeTab === 'playerTotal' && playerTotalRanks.map((item, idx) => renderRank(item, idx, 'player'))}
          {activeTab === 'teamAvg' && teamAvgRanks.map((item, idx) => renderRank(item, idx, 'team'))}
        </ScrollView>
      </View>

      <TabBar />
    </View>
  )
}
