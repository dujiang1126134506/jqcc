import type {
  Team,
  Player,
  Match,
  Season,
  PlayerScore,
  UserInfo,
  RoleType,
  MatchStage,
  StageType,
  MatchStatus,
} from '../types'
import { calcTotalScore } from '../types'

// ========== 赛季数据 ==========
export const seasons: Season[] = [
  {
    id: 's6',
    name: 'S6 赛季',
    startDate: '2025-03-01',
    endDate: '2025-08-31',
    status: 'ongoing',
    isCurrent: true,
  },
  {
    id: 's5',
    name: 'S5 赛季',
    startDate: '2024-09-01',
    endDate: '2025-02-28',
    status: 'finished',
    isCurrent: false,
  },
  {
    id: 's4',
    name: 'S4 赛季',
    startDate: '2024-03-01',
    endDate: '2024-08-31',
    status: 'finished',
    isCurrent: false,
  },
]

// ========== 战队数据 ==========
export const teams: Team[] = [
  {
    id: 't1',
    name: '雷霆战队',
    logo: '⚡',
    color: '#1E90FF',
    playerIds: ['p1', 'p2', 'p3', 'p4', 'p5', 'p18'],
  },
  {
    id: 't2',
    name: '烈焰雄狮',
    logo: '🔥',
    color: '#FF6347',
    playerIds: ['p6', 'p7', 'p8', 'p9', 'p10', 'p19'],
  },
  {
    id: 't3',
    name: '星辰战队',
    logo: '⭐',
    color: '#FFD700',
    playerIds: ['p11', 'p12', 'p13', 'p14', 'p15', 'p20'],
  },
  {
    id: 't4',
    name: '暗影刺客',
    logo: '🗡️',
    color: '#9370DB',
    playerIds: ['p16', 'p17', 'p21', 'p22', 'p23', 'p24'],
  },
]

// ========== 选手数据 ==========
const avatarColors = [
  'linear-gradient(135deg,#FFB6C1,#FF69B4)',
  'linear-gradient(135deg,#87CEEB,#4682B4)',
  'linear-gradient(135deg,#98FB98,#32CD32)',
  'linear-gradient(135deg,#FFDAB9,#FFA500)',
  'linear-gradient(135deg,#DDA0DD,#9370DB)',
  'linear-gradient(135deg,#ADD8E6,#1E90FF)',
  'linear-gradient(135deg,#F0E68C,#FFD700)',
  'linear-gradient(135deg,#FFA07A,#FF4500)',
]

function makePlayer(
  id: string,
  name: string,
  teamId: string,
  role: RoleType,
  identity: '首发' | '替补' = '首发',
): Player {
  const idx = parseInt(id.replace('p', '')) % avatarColors.length
  return {
    id,
    name,
    avatar: avatarColors[idx],
    teamId,
    role,
    identity,
  }
}

export const players: Player[] = [
  // 雷霆战队
  makePlayer('p1', '雷鸣', 't1', '上单'),
  makePlayer('p2', '风暴', 't1', '打野'),
  makePlayer('p3', '闪电', 't1', '中单'),
  makePlayer('p4', '霹雳', 't1', '射手'),
  makePlayer('p5', '惊雷', 't1', '辅助'),
  makePlayer('p18', '电闪', 't1', '打野', '替补'),
  // 烈焰雄狮
  makePlayer('p6', '火舞', 't2', '上单'),
  makePlayer('p7', '炎帝', 't2', '打野'),
  makePlayer('p8', '赤炎', 't2', '中单'),
  makePlayer('p9', '烈焰', 't2', '射手'),
  makePlayer('p10', '火山', 't2', '辅助'),
  makePlayer('p19', '火花', 't2', '中单', '替补'),
  // 星辰战队
  makePlayer('p11', '北极星', 't3', '上单'),
  makePlayer('p12', '流星', 't3', '打野'),
  makePlayer('p13', '星河', 't3', '中单'),
  makePlayer('p14', '恒星', 't3', '射手'),
  makePlayer('p15', '月神', 't3', '辅助'),
  makePlayer('p20', '彗星', 't3', '辅助', '替补'),
  // 暗影刺客
  makePlayer('p16', '暗影', 't4', '上单'),
  makePlayer('p17', '刺客', 't4', '打野'),
  makePlayer('p21', '夜影', 't4', '中单'),
  makePlayer('p22', '影刃', 't4', '射手'),
  makePlayer('p23', '暗羽', 't4', '辅助'),
  makePlayer('p24', '幻影', 't4', '上单', '替补'),
]

// ========== 赛程与选手得分数据 ==========
function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`
}

function dateStr(month: number, day: number) {
  return `2025-${pad(month)}-${pad(day)}`
}

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

const STAGE_MAP: Record<MatchStage, StageType> = {
  regular: '常规赛',
  revival: '复活赛',
  playoff: '季后赛',
  final: '总决赛',
}

const stages: { stage: MatchStage; rounds: number; monthStart: number; dayStart: number }[] = [
  { stage: 'regular', rounds: 10, monthStart: 3, dayStart: 1 },
  { stage: 'revival', rounds: 3, monthStart: 6, dayStart: 5 },
  { stage: 'playoff', rounds: 4, monthStart: 7, dayStart: 1 },
  { stage: 'final', rounds: 2, monthStart: 8, dayStart: 10 },
]

export const matches: Match[] = []
export const playerScores: PlayerScore[] = []

let scoreId = 1
let matchId = 1

function stageSeed(stage: MatchStage): number {
  switch (stage) {
    case 'regular':
      return 12345
    case 'revival':
      return 23456
    case 'playoff':
      return 34567
    case 'final':
      return 45678
  }
}

for (const stg of stages) {
  const rand = seededRandom(stageSeed(stg.stage))
  let day = stg.dayStart
  let month = stg.monthStart

  for (let round = 1; round <= stg.rounds; round++) {
    const pairings = [
      [
        ['t1', 't2'],
        ['t3', 't4'],
      ],
      [
        ['t1', 't3'],
        ['t2', 't4'],
      ],
      [
        ['t1', 't4'],
        ['t2', 't3'],
      ],
    ]
    const pairIdx = (round - 1) % 3

    for (const pair of pairings[pairIdx]) {
      const [teamA, teamB] = pair
      const teamAWin = rand() > 0.5
      const winner = teamAWin ? teamA : teamB

      // 计算比分
      const boFormat = stg.stage === 'final' ? 7 : stg.stage === 'playoff' ? 5 : 3
      const winnerScore = Math.ceil(boFormat / 2)
      const loserScore = Math.floor(rand() * (winnerScore - 1))
      const scoreA = teamAWin ? winnerScore : loserScore
      const scoreB = teamAWin ? loserScore : winnerScore

      // 判断比赛状态（最后1轮之前的都是已结束，当前轮进行中，未来轮未开始）
      let status: MatchStatus = 'finished'
      if (stg.stage === 'final' && round === 2) {
        status = 'ongoing'
      }

      const m: Match = {
        id: `m${matchId++}`,
        seasonId: 's6',
        stage: stg.stage,
        round,
        date: dateStr(month, day),
        time: '19:00',
        teamAId: teamA,
        teamBId: teamB,
        scoreA,
        scoreB,
        status,
        boFormat,
      }
      matches.push(m)

      // 生成双方选手得分
      const allPlayersInMatch: string[] = [
        ...teams.find((t) => t.id === teamA)!.playerIds.slice(0, 5),
        ...teams.find((t) => t.id === teamB)!.playerIds.slice(0, 5),
      ]

      // 随机选MVP（获胜方）
      const winnerPlayers = allPlayersInMatch.filter((pid) => {
        const pl = players.find((p) => p.id === pid)!
        return pl.teamId === winner
      })
      const mvpIdx = Math.floor(rand() * winnerPlayers.length)
      const mvpPid = winnerPlayers[mvpIdx]

      // SVP（败方）
      const loserPlayers = allPlayersInMatch.filter((pid) => {
        const pl = players.find((p) => p.id === pid)!
        return pl.teamId !== winner
      })
      const svpIdx = Math.floor(rand() * loserPlayers.length)
      const svpPid = loserPlayers[svpIdx]

      // 背锅（败方随机一个）
      const backpotIdx = Math.floor(rand() * loserPlayers.length)
      const backpotPid = loserPlayers[backpotIdx]

      for (const pid of allPlayersInMatch) {
        const pl = players.find((p) => p.id === pid)!
        const isWinner = pl.teamId === winner
        const baseScore = isWinner ? 80 + rand() * 30 : 40 + rand() * 40
        const voteScore = Math.floor(rand() * 20)
        const skillScore = Math.floor(10 + rand() * 40)
        const foulScore = rand() > 0.8 ? -Math.floor(5 + rand() * 15) : 0
        const extraScore = rand() > 0.7 ? Math.floor(rand() * 10) : 0

        const isMVP = pid === mvpPid
        const isSVP = pid === svpPid
        const isBackpot = pid === backpotPid

        const scoreData = {
          id: `s${scoreId++}`,
          playerId: pid,
          playerName: pl.name,
          matchId: m.id,
          seasonId: 's6',
          teamId: pl.teamId,
          stage: STAGE_MAP[stg.stage],
          round,
          date: m.date,
          identity: pl.identity,
          role: pl.role,
          isMVP,
          isSVP,
          isBackpot,
          winLoseScore: Math.floor(baseScore),
          voteScore,
          skillScore,
          foulScore,
          extraScore: isMVP ? extraScore + 20 : isSVP ? extraScore + 10 : extraScore,
        }

        playerScores.push({
          ...scoreData,
          totalScore: calcTotalScore(scoreData),
        })
      }
    }

    day += 3
    if (day > 28) {
      day = day - 28
      month++
    }
  }
}

// ========== 用户数据 ==========
export const defaultUser: UserInfo = {
  id: 'u001',
  nickname: '电竞小粉丝',
  avatar: 'linear-gradient(135deg,#07c160,#00a854)',
}
