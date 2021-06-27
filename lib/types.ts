export type EventType = 'id' | 'version' | 'info' | 'start' | 'data'

export type GameInfo = {
  visteam: string
  hometeam: string
  site: string
  date: string
  number: string
  starttime: string
  daynight: string
  usedh: string
  umphome: string
  ump1b: string
  ump2b: string
  ump3b: string
  howscored: string
  pitches: string
  oscorer: string
  temp: string
  winddir: string
  windspeed: string
  fieldcond: string
  precip: string
  sky: string
  timeofgame: string
  attendance: string
  wp: string
  lp: string
  save: string
}

export type Player = {
  id: string
  name: string
  position: number
  type: 'sub' | 'start'
  inningEntered: number
}

export type Comment = {
  type: 'comment'
  text: string
}

export type AtBat = {
  type: 'at-bat'
  playerId: string
  count: string
  pitchSequence: string
  result: string
}

export type RunnerAdjustment = {
  type: 'runner-adjustment'
  playerId: string
  base: number
}

export type GameplayEvent = AtBat | Comment | RunnerAdjustment

export type Lineup = Player[][]

export type Game = {
  id: string
  info: GameInfo
  version: string
  lineup: {
    home: Lineup
    visiting: Lineup
  }
  pitchers: {
    home: Player[]
    visiting: Player[]
  }
  data: {
    er: {
      [playerId: string]: number
    }
  }
  play: {
    home: GameplayEvent[][]
    visiting: GameplayEvent[][]
  }
}

export type FileOptions = {
  outputPath?: string
  filename?: string
}

export type CacheItem =
  | {
      playerType: 'hitter'
      lineupIndex: number
      player: Player
      teamType: 'home' | 'visiting'
    }
  | {
      playerType: 'pitcher'
      player: Player
      teamType: 'home' | 'visiting'
    }

export type GameMetaData = {
  game: Game
  currentInning: number
  subCache: CacheItem[]
}
