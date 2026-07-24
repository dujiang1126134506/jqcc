import { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useAppStore } from '../../store'
import { MOCK_SEASONS, MOCK_MATCHES, MOCK_TEAMS } from '../../data/mockData'
import type { MatchStage } from '../../types'
import { STAGE_LABELS } from '../../types'
import SeasonSelector from '../../components/SeasonSelector'
import TabBar from '../../components/TabBar'
import './index.scss'

const STAGE_FILTERS: { key: 'all' | MatchStage; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'regular', label: '常规赛' },
  { key: 'revival', label: '复活赛' },
  { key: 'playoff', label: '季后赛' },
  { key: 'final', label: '总决赛' },
]

interface MatchWithTeam extends ReturnType<typeof getMatchDetail> {}

function getMatchDetail(match: (typeof MOCK_MATCHES)[number]) {
  const homeTeam = MOCK_TEAMS.find((t) => t.id === match.homeTeamId)!
  const awayTeam = MOCK_TEAMS.find((t) => t.id === match.awayTeamId)!
  return {
    ...match,
    homeTeam,
    awayTeam,
  }
}

export default function Schedule() {
  const isLogin = useAppStore((s) => s.isLogin)
  const [currentSeasonId, setCurrentSeasonId] = useState(
    MOCK_SEASONS.find((s) => s.isActive)?.id || MOCK_SEASONS[0].id,
  )
  const [stageFilter, setStageFilter] = useState<'all' | MatchStage>('all')

  if (!isLogin) {
    Taro.redirectTo({ url: '/pages/login/index' })
    return null
  }

  const filteredMatches = useMemo(() => {
    let list = MOCK_MATCHES.filter((m) => m.seasonId === currentSeasonId)
    if (stageFilter !== 'all') {
      list = list.filter((m) => m.stage === stageFilter)
    }
    return list.map((m) => getMatchDetail(m)).sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date)
      return a.time.localeCompare(b.time)
    })
  }, [currentSeasonId, stageFilter])

  // 按日期分组
  const groupedMatches = useMemo(() => {
    const groups = new Map<string, MatchWithTeam[]>()
    filteredMatches.forEach((m) => {
      if (!groups.has(m.date)) {
        groups.set(m.date, [])
      }
      groups.get(m.date)!.push(m)
    })
    return Array.from(groups.entries()).map(([date, matches]) => ({ date, matches }))
  }, [filteredMatches])

  const statusText = (status: string) => {
    if (status === 'upcoming') return '未开始'
    if (status === 'ongoing') return '进行中'
    return '已结束'
  }

  const statusColor = (status: string) => {
    if (status === 'upcoming') return '#666'
    if (status === 'ongoing') return '#ef4444'
    return '#999'
  }

  return (
    <View className='schedule-page'>
      <View className='header'>
        <View className='header-bg' />
        <View className='header-content'>
          <Text className='header-title'>📅 赛程安排</Text>
          <SeasonSelector
            seasons={MOCK_SEASONS}
            currentSeasonId={currentSeasonId}
            onChange={setCurrentSeasonId}
          />
        </View>
      </View>

      <View className='content-area'>
        <ScrollView className='stage-filter' scrollX>
          {STAGE_FILTERS.map((f) => (
            <View
              key={f.key}
              className={`filter-item ${stageFilter === f.key ? 'active' : ''}`}
              onClick={() => setStageFilter(f.key)}
            >
              <Text>{f.label}</Text>
            </View>
          ))}
        </ScrollView>

        <ScrollView className='match-list' scrollY>
          {groupedMatches.length === 0 && (
            <View className='empty-state'>
              <Text className='empty-icon'>📭</Text>
              <Text className='empty-text'>暂无赛程</Text>
            </View>
          )}

          {groupedMatches.map((group) => (
            <View key={group.date} className='date-group'>
              <View className='date-header'>
                <Text className='date-text'>{group.date}</Text>
                <Text className='date-week'>{getWeekday(group.date)}</Text>
              </View>

              {group.matches.map((match) => (
                <View key={match.id} className='match-card'>
                  <View className='match-info'>
                    <Text className='match-time'>{match.time}</Text>
                    <Text className='match-stage' style={{ color: statusColor(match.status) }}>
                      {match.status === 'ongoing' && <Text className='live-dot'>●</Text>}
                      {statusText(match.status)}
                    </Text>
                    <Text className='match-format'>{match.format} · {STAGE_LABELS[match.stage]}</Text>
                  </View>

                  <View className='match-body'>
                    <View className='team team-left'>
                      <View className='team-logo' style={{ background: match.homeTeam.themeColor + '22' }}>
                        <Text className='logo-text'>{match.homeTeam.logo}</Text>
                      </View>
                      <Text className='team-name'>{match.homeTeam.name}</Text>
                    </View>

                    <View className='match-score'>
                      {match.status === 'upcoming' ? (
                        <Text className='vs-text'>VS</Text>
                      ) : (
                        <View className='score-wrap'>
                          <Text className={`score ${match.homeScore > match.awayScore ? 'winner' : ''}`}>
                            {match.homeScore}
                          </Text>
                          <Text className='score-divider'>:</Text>
                          <Text className={`score ${match.awayScore > match.homeScore ? 'winner' : ''}`}>
                            {match.awayScore}
                          </Text>
                        </View>
                      )}
                    </View>

                    <View className='team team-right'>
                      <View className='team-logo' style={{ background: match.awayTeam.themeColor + '22' }}>
                        <Text className='logo-text'>{match.awayTeam.logo}</Text>
                      </View>
                      <Text className='team-name'>{match.awayTeam.name}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>

      <TabBar />
    </View>
  )
}

function getWeekday(dateStr: string): string {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const d = new Date(dateStr)
  return days[d.getDay()]
}
