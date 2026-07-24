import type { Team, Player, PlayerScore, Season, Match, UserInfo } from '../types'

// ========== 战队数据 ==========
export const MOCK_TEAMS: Team[] = [
  { id: 't1', name: '星辰战队', logo: '⭐', themeColor: '#6366f1', playerIds: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'] },
  { id: 't2', name: '烈焰战队', logo: '🔥', themeColor: '#ef4444', playerIds: ['p7', 'p8', 'p9', 'p10', 'p11', 'p12'] },
  { id: 't3', name: '风暴战队', logo: '⚡', themeColor: '#f59e0b', playerIds: ['p13', 'p14', 'p15', 'p16', 'p17', 'p18'] },
  { id: 't4', name: '寒冰战队', logo: '❄️', themeColor: '#06b6d4', playerIds: ['p19', 'p20', 'p21', 'p22', 'p23', 'p24'] },
]

// ========== 选手数据 ==========
const playerNames = [
  '林风', '苏墨', '陈默', '叶飞', '楚云', '林溪',
  '周扬', '吴迪', '郑浩', '孙越', '钱峰', '赵雷',
  '王凯', '李轩', '张伟', '刘强', '黄海', '徐天',
  '陆沉', '姜宇', '范明', '方旭', '石敢', '谭言',
]

export const MOCK_PLAYERS: Player[] = MOCK_TEAMS.flatMap((team, ti) => {
  const positions: Player['position'][] = ['上单', '打野', '中单', '射手', '辅助', '替补']
  return positions.map((pos, i) => ({
    id: team.playerIds[i],
    name: playerNames[ti * 6 + i],
    avatar: `linear-gradient(135deg, ${team.themeColor}55, ${team.themeColor}cc)`,
    teamId: team.id,
    position: pos,
  }))
})

// ========== 赛季数据 ==========
export const MOCK_SEASONS: Season[] = [
  { id: 's4', name: 'S4 赛季', isActive: false, startDate: '2023-09-01', endDate: '2023-12-31' },
  { id: 's5', name: 'S5 赛季', isActive: true, startDate: '2024-03-01', endDate: '2024-06-30' },
  { id: 's6', name: 'S6 赛季', isActive: false, startDate: '2024-09-01' },
]

// ========== 赛程数据（S5 赛季） ==========
function createMatch(id: string, stage: Match['stage'], round: number, date: string, time: string,
  homeIdx: number, awayIdx: number, format: Match['format'], hs: number, as: number, status: Match['status']): Match {
  return {
    id, seasonId: 's5', stage, round, date, time,
    homeTeamId: MOCK_TEAMS[homeIdx].id,
    awayTeamId: MOCK_TEAMS[awayIdx].id,
    format, homeScore: hs, awayScore: as, status,
  }
}

export const MOCK_MATCHES: Match[] = [
  // 常规赛 第1轮
  createMatch('m1', 'regular', 1, '2024-03-02', '19:00', 0, 1, 'BO3', 2, 1, 'finished'),
  createMatch('m2', 'regular', 1, '2024-03-03', '19:00', 2, 3, 'BO3', 0, 2, 'finished'),
  // 常规赛 第2轮
  createMatch('m3', 'regular', 2, '2024-03-09', '19:00', 0, 2, 'BO3', 2, 0, 'finished'),
  createMatch('m4', 'regular', 2, '2024-03-10', '19:00', 1, 3, 'BO3', 1, 2, 'finished'),
  // 常规赛 第3轮
  createMatch('m5', 'regular', 3, '2024-03-16', '19:00', 0, 3, 'BO3', 2, 1, 'finished'),
  createMatch('m6', 'regular', 3, '2024-03-17', '19:00', 1, 2, 'BO3', 2, 0, 'finished'),
  // 常规赛 第4轮
  createMatch('m7', 'regular', 4, '2024-03-23', '19:00', 2, 0, 'BO3', 1, 2, 'finished'),
  createMatch('m8', 'regular', 4, '2024-03-24', '19:00', 3, 1, 'BO3', 0, 2, 'finished'),
  // 常规赛 第5轮
  createMatch('m9', 'regular', 5, '2024-03-30', '19:00', 1, 0, 'BO3', 2, 1, 'finished'),
  createMatch('m10', 'regular', 5, '2024-03-31', '19:00', 3, 2, 'BO3', 1, 2, 'finished'),
  // 复活赛
  createMatch('m11', 'revival', 1, '2024-04-06', '19:00', 2, 3, 'BO5', 3, 1, 'finished'),
  // 季后赛
  createMatch('m12', 'playoff', 1, '2024-04-13', '19:00', 0, 2, 'BO5', 3, 2, 'finished'),
  createMatch('m13', 'playoff', 2, '2024-04-14', '19:00', 1, 0, 'BO5', 2, 3, 'finished'),
  // 总决赛
  createMatch('m14', 'final', 1, '2024-04-20', '19:00', 0, 1, 'BO7', 4, 3, 'finished'),
  // 未开始的比赛（S6 季前赛，仍用 S5 id 保持数据量）
  createMatch('m15', 'regular', 6, '2024-04-27', '19:00', 0, 3, 'BO3', 0, 0, 'upcoming'),
  createMatch('m16', 'regular', 6, '2024-04-28', '19:00', 1, 2, 'BO3', 0, 0, 'upcoming'),
]

// ========== 选手得分数据 ==========
function makeScore(playerId: string, matchId: string, stage: Match['stage'], round: number, date: string,
  winLoseScore: number, voteScore: number, skillScore: number, penaltyScore: number, extraScore: number,
  isMVP = false, isSVP = false, isBackpot = false): PlayerScore {
  return {
    playerId, seasonId: 's5', matchId, stage, round, date,
    identity: playerId.endsWith('6') || playerId.endsWith('12') || playerId.endsWith('18') || playerId.endsWith('24') ? '替补' : '首发',
    format: stage === 'final' ? 'BO7' : (stage === 'regular' ? 'BO3' : 'BO5'),
    winLoseScore, voteScore, skillScore, penaltyScore, extraScore,
    isMVP, isSVP, isBackpot,
  }
}

// 简化版得分数据：为每位首发选手生成有差别的总分，用于排行榜展示
export const MOCK_PLAYER_SCORES: PlayerScore[] = [
  // ========== m1: 星辰 2-1 烈焰 ==========
  // 星辰胜，p3(MVP) 高分
  makeScore('p1', 'm1', 'regular', 1, '2024-03-02', 20, 5, 12, 0, 0),
  makeScore('p2', 'm1', 'regular', 1, '2024-03-02', 20, 3, 10, -2, 0),
  makeScore('p3', 'm1', 'regular', 1, '2024-03-02', 20, 10, 15, 0, 5, true),
  makeScore('p4', 'm1', 'regular', 1, '2024-03-02', 20, 8, 14, 0, 0),
  makeScore('p5', 'm1', 'regular', 1, '2024-03-02', 20, 6, 11, 0, 0),
  // 烈焰败，p8(SVP)
  makeScore('p7', 'm1', 'regular', 1, '2024-03-02', -10, 2, 8, -3, 0, false, false, true),
  makeScore('p8', 'm1', 'regular', 1, '2024-03-02', -10, 7, 13, 0, 0, false, true),
  makeScore('p9', 'm1', 'regular', 1, '2024-03-02', -10, 1, 6, 0, 0),
  makeScore('p10', 'm1', 'regular', 1, '2024-03-02', -10, 4, 10, 0, 0),
  makeScore('p11', 'm1', 'regular', 1, '2024-03-02', -10, 3, 7, -1, 0),

  // ========== m2: 风暴 0-2 寒冰 ==========
  makeScore('p13', 'm2', 'regular', 1, '2024-03-03', -20, 1, 5, -5, 0, false, false, true),
  makeScore('p14', 'm2', 'regular', 1, '2024-03-03', -20, 2, 7, 0, 0),
  makeScore('p15', 'm2', 'regular', 1, '2024-03-03', -20, 3, 8, 0, 0),
  makeScore('p16', 'm2', 'regular', 1, '2024-03-03', -20, 2, 6, -2, 0),
  makeScore('p17', 'm2', 'regular', 1, '2024-03-03', -20, 1, 4, 0, 0),
  makeScore('p19', 'm2', 'regular', 1, '2024-03-03', 20, 6, 12, 0, 0),
  makeScore('p20', 'm2', 'regular', 1, '2024-03-03', 20, 9, 14, 0, 3, true),
  makeScore('p21', 'm2', 'regular', 1, '2024-03-03', 20, 5, 10, 0, 0),
  makeScore('p22', 'm2', 'regular', 1, '2024-03-03', 20, 7, 13, 0, 0),
  makeScore('p23', 'm2', 'regular', 1, '2024-03-03', 20, 4, 9, 0, 0),

  // ========== m3: 星辰 2-0 风暴 ==========
  makeScore('p1', 'm3', 'regular', 2, '2024-03-09', 20, 4, 11, 0, 0),
  makeScore('p2', 'm3', 'regular', 2, '2024-03-09', 20, 7, 13, 0, 2, true),
  makeScore('p3', 'm3', 'regular', 2, '2024-03-09', 20, 6, 12, 0, 0),
  makeScore('p4', 'm3', 'regular', 2, '2024-03-09', 20, 5, 10, 0, 0),
  makeScore('p5', 'm3', 'regular', 2, '2024-03-09', 20, 3, 9, 0, 0),
  makeScore('p13', 'm3', 'regular', 2, '2024-03-09', -20, 2, 6, -3, 0),
  makeScore('p14', 'm3', 'regular', 2, '2024-03-09', -20, 1, 4, 0, 0, false, false, true),
  makeScore('p15', 'm3', 'regular', 2, '2024-03-09', -20, 3, 7, 0, 0),
  makeScore('p16', 'm3', 'regular', 2, '2024-03-09', -20, 2, 5, 0, 0),
  makeScore('p17', 'm3', 'regular', 2, '2024-03-09', -20, 4, 8, 0, 0, false, true),

  // ========== m4: 烈焰 1-2 寒冰 ==========
  makeScore('p7', 'm4', 'regular', 2, '2024-03-10', -10, 3, 9, 0, 0, false, false, true),
  makeScore('p8', 'm4', 'regular', 2, '2024-03-10', -10, 6, 12, 0, 0, false, true),
  makeScore('p9', 'm4', 'regular', 2, '2024-03-10', -10, 2, 7, -2, 0),
  makeScore('p10', 'm4', 'regular', 2, '2024-03-10', -10, 5, 11, 0, 0),
  makeScore('p11', 'm4', 'regular', 2, '2024-03-10', -10, 4, 8, 0, 0),
  makeScore('p19', 'm4', 'regular', 2, '2024-03-10', 20, 8, 14, 0, 3, true),
  makeScore('p20', 'm4', 'regular', 2, '2024-03-10', 20, 6, 11, 0, 0),
  makeScore('p21', 'm4', 'regular', 2, '2024-03-10', 20, 5, 10, 0, 0),
  makeScore('p22', 'm4', 'regular', 2, '2024-03-10', 20, 7, 13, 0, 0),
  makeScore('p23', 'm4', 'regular', 2, '2024-03-10', 20, 4, 9, 0, 0),

  // ========== 总决赛 m14: 星辰 4-3 烈焰 ==========
  makeScore('p1', 'm14', 'final', 1, '2024-04-20', 40, 15, 25, 0, 5),
  makeScore('p2', 'm14', 'final', 1, '2024-04-20', 40, 10, 20, -3, 0),
  makeScore('p3', 'm14', 'final', 1, '2024-04-20', 40, 20, 30, 0, 10, true),
  makeScore('p4', 'm14', 'final', 1, '2024-04-20', 40, 18, 28, 0, 5),
  makeScore('p5', 'm14', 'final', 1, '2024-04-20', 40, 12, 22, 0, 0),
  makeScore('p7', 'm14', 'final', 1, '2024-04-20', -40, 5, 18, -5, 0, false, false, true),
  makeScore('p8', 'm14', 'final', 1, '2024-04-20', -40, 18, 28, 0, 5, false, true),
  makeScore('p9', 'm14', 'final', 1, '2024-04-20', -40, 8, 16, 0, 0),
  makeScore('p10', 'm14', 'final', 1, '2024-04-20', -40, 12, 22, 0, 0),
  makeScore('p11', 'm14', 'final', 1, '2024-04-20', -40, 6, 14, -2, 0),
]

// ========== Mock 用户 ==========
export const MOCK_USER: UserInfo = {
  id: 'u001',
  nickName: '电竞小萌新',
  avatarUrl: '',
}
