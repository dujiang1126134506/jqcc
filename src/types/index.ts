// 类型定义 - 小程序版（与 H5 版逻辑一致，仅 UI 组件不同）

/** 比赛阶段 */
export type MatchStage = 'regular' | 'revival' | 'playoff' | 'final'

/** 比赛阶段中文映射 */
export const STAGE_LABELS: Record<MatchStage, string> = {
  regular: '常规赛',
  revival: '复活赛',
  playoff: '季后赛',
  final: '总决赛',
}

/** 选手位置 */
export type PlayerPosition = '上单' | '打野' | '中单' | '射手' | '辅助'

/** 选手身份 */
export type PlayerIdentity = '首发' | '替补'

/** 比赛版型 */
export type GameFormat = 'BO3' | 'BO5' | 'BO7'

/** 战队信息 */
export interface Team {
  id: string
  name: string
  logo: string // emoji 作为 logo
  themeColor: string // 主题色（渐变起点）
  playerIds: string[]
}

/** 选手信息 */
export interface Player {
  id: string
  name: string
  avatar: string // 头像背景色（渐变色）
  teamId: string
  position: PlayerPosition
}

/** 选手单场得分记录 */
export interface PlayerScore {
  playerId: string
  seasonId: string
  matchId: string
  stage: MatchStage
  round: number // 第几轮
  date: string // 日期 YYYY-MM-DD
  identity: PlayerIdentity
  format: GameFormat
  winLoseScore: number // 胜负分
  voteScore: number // 投票分
  skillScore: number // 技能分
  penaltyScore: number // 违规分
  extraScore: number // 额外分
  isMVP: boolean
  isSVP: boolean
  isBackpot: boolean // 是否背锅
}

/** 计算选手总分 */
export function calcTotalScore(s: PlayerScore): number {
  return s.winLoseScore + s.voteScore + s.skillScore + s.penaltyScore + s.extraScore
}

/** 赛季信息 */
export interface Season {
  id: string
  name: string
  isActive: boolean // 是否当前进行中
  startDate: string
  endDate?: string
}

/** 赛程比赛 */
export interface Match {
  id: string
  seasonId: string
  stage: MatchStage
  round: number
  date: string
  time: string // HH:mm
  homeTeamId: string
  awayTeamId: string
  format: GameFormat
  homeScore: number
  awayScore: number
  status: 'upcoming' | 'ongoing' | 'finished' // 未开始 / 进行中 / 已结束
}

/** 用户信息 */
export interface UserInfo {
  id: string
  nickName: string
  avatarUrl: string
}
