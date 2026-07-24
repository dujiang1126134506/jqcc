// ========== 数据类型定义 ==========

/** 赛程阶段（英文编码） */
export type MatchStage = 'regular' | 'revival' | 'playoff' | 'final'

/** 赛程阶段（中文标签） */
export type StageType = '常规赛' | '复活赛' | '季后赛' | '总决赛'

/** 选手身份 */
export type PlayerRole = '首发' | '替补'

/** 版型（场上位置） */
export type RoleType = '上单' | '打野' | '中单' | '射手' | '辅助'

/** 比赛状态 */
export type MatchStatus = 'upcoming' | 'ongoing' | 'finished'

/** 用户信息 */
export interface UserInfo {
  id: string
  nickname: string
  avatar: string
}

/** 战队信息 */
export interface Team {
  id: string
  name: string
  logo: string /** 战队 logo，使用 emoji 表示 */
  color: string /** 战队主题色 */
  playerIds: string[] /** 选手 id 列表 */
}

/** 选手信息 */
export interface Player {
  id: string
  name: string
  avatar: string /** 头像，使用渐变颜色字符串表示 */
  teamId: string
  role: RoleType /** 场上位置（版型） */
  identity: PlayerRole /** 身份 */
}

/** 单场比赛选手得分详情 */
export interface PlayerScore {
  id: string
  playerId: string
  playerName: string
  matchId: string
  seasonId: string
  teamId: string
  stage: StageType /** 赛程阶段 */
  round: number /** 第几轮 */
  date: string /** 日期，格式 YYYY-MM-DD */
  identity: PlayerRole /** 身份 */
  role: RoleType /** 版型（位置） */
  isMVP: boolean
  isSVP: boolean
  isBackpot: boolean /** 是否背锅 */
  winLoseScore: number /** 胜负分 */
  voteScore: number /** 投票分 */
  skillScore: number /** 技能分 */
  foulScore: number /** 违规分（负数表示扣分） */
  extraScore: number /** 额外分 */
  totalScore: number /** 总分（=胜负分+投票分+技能分+违规分+额外分） */
}

/** 比赛 */
export interface Match {
  id: string
  seasonId: string
  stage: MatchStage
  round: number
  date: string
  time: string
  teamAId: string
  teamBId: string
  scoreA: number
  scoreB: number
  status: MatchStatus
  boFormat: number /** BO3 / BO5 等 */
}

/** 赛季 */
export interface Season {
  id: string
  name: string
  startDate: string
  endDate: string
  status: 'ongoing' | 'finished'
  isCurrent?: boolean
}

/** 计算选手总得分 */
export function calcTotalScore(s: Omit<PlayerScore, 'totalScore'>): number {
  return (
    s.winLoseScore +
    s.voteScore +
    s.skillScore +
    s.foulScore +
    s.extraScore
  )
}

/** 排行榜项 - 战队总分榜 */
export interface TeamScoreRankItem {
  rank: number
  teamId: string
  teamName: string
  logo: string
  color: string
  totalScore: number
  playerCount: number
}

/** 排行榜项 - 选手总分榜 */
export interface PlayerScoreRankItem {
  rank: number
  playerId: string
  playerName: string
  avatar: string
  teamName: string
  teamColor: string
  role: RoleType
  totalScore: number
  mvpCount: number
  svpCount: number
}

/** 排行榜项 - 战队均分榜 */
export interface TeamAvgRankItem {
  rank: number
  teamId: string
  teamName: string
  logo: string
  color: string
  avgScore: number
  playerCount: number
  totalScore: number
}
