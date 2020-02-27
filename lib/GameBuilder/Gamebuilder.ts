import { Game } from '../types'

import {
  parseNewGame,
  parseGameInfo,
  parseLineupEvent,
  parseVersion,
  parseData,
  parsePlayEvent
} from './parsers'
import { getEmptyGame } from './getEmptyGame'

export class GameBuilder {
  private games: Game[]

  constructor() {
    this.games = []
  }

  getParser = (key: string) => {
    switch (key) {
      case 'id': {
        return parseNewGame
      }
      case 'version': {
        return parseVersion
      }
      case 'info': {
        return parseGameInfo
      }
      case 'sub':
      case 'start': {
        return parseLineupEvent
      }
      case 'data': {
        return parseData
      }
      case 'play': {
        return parsePlayEvent
      }
    }
  }

  getGames = () => {
    return this.games
  }

  getCurrentGame = () => {
    return this.games[this.games.length - 1]
  }

  addGame = (game?: Game) => {
    this.games.push(
      game ? game : getEmptyGame({ id: (this.games.length + 1).toString() })
    )
  }

  receiveGameEvent = (event: string) => {
    const eventArray = event.split(',')
    const eventType = eventArray[0]

    const parser = this.getParser(eventType)
    if (parser) {
      parser(this, eventArray)
    } else {
      // eventually alert
    }
  }
}
