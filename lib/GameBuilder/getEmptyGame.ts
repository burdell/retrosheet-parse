import { Game } from '../types'

export function getEmptyGame(initial: Partial<Game>): Game {
  return {
    id: '',
    version: '',
    lineup: {
      home: [],
      visiting: []
    },
    info: {
      visteam: '',
      hometeam: '',
      site: '',
      date: '',
      number: '',
      starttime: '',
      daynight: '',
      usedh: '',
      umphome: '',
      ump1b: '',
      ump2b: '',
      ump3b: '',
      howscored: '',
      pitches: '',
      oscorer: '',
      temp: '',
      winddir: '',
      windspeed: '',
      fieldcond: '',
      precip: '',
      sky: '',
      timeofgame: '',
      attendance: '',
      wp: '',
      lp: '',
      save: ''
    },
    data: {
      er: {}
    },
    play: {
      home: [],
      visiting: []
    },
    ...initial
  }
}
