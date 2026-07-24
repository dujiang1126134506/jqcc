import { create } from 'zustand'
import type {
  Team,
  Player,
  Match,
  Season,
  PlayerScore,
  UserInfo,
} from '../types'
import { teams as mockTeams } from '../data/mockData'
import { players as mockPlayers } from '../data/mockData'
import { matches as mockMatches } from '../data/mockData'
import { seasons as mockSeasons } from '../data/mockData'
import { playerScores as mockPlayerScores } from '../data/mockData'
import { defaultUser } from '../data/mockData'

interface GameState {
  user: UserInfo | null
  teams: Team[]
  players: Player[]
  matches: Match[]
  seasons: Season[]
  playerScores: PlayerScore[]
  setUser: (user: UserInfo) => void
  clearUser: () => void
}

export const useGameStore = create<GameState>((set) => ({
  user: null,
  teams: mockTeams,
  players: mockPlayers,
  matches: mockMatches,
  seasons: mockSeasons,
  playerScores: mockPlayerScores,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))

// 导出 defaultUser 供初始值使用
export { defaultUser }
