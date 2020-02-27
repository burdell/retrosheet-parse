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

export type GameplayEvent = AtBat | Comment

export type Lineup = Player[][]

export type Game = {
  id: string
  info: GameInfo
  version: string
  lineup: {
    home: Lineup
    visiting: Lineup
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
  outputPath: string
  filename?: string
}
