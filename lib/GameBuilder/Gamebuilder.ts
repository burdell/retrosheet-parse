import { Game, GameMetaData } from '../types'

import {
  parseNewGame,
  parseGameInfo,
  parseLineupEvent,
  parseVersion,
  parseData,
  parsePlayEvent,
  parseRunnerAdjustment
} from './parsers'
import { getEmptyGame } from './getEmptyGame'

export class GameBuilder {
  private games: Game[]
  private currentGameMetaData: GameMetaData | undefined

  constructor() {
    this.games = []
    this.currentGameMetaData = undefined
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
      case 'radj': {
        return parseRunnerAdjustment
      }
    }
  }

  getGames = () => {
    return this.games
  }

  getCurrentGame = () => {
    const currentGame = this.currentGameMetaData?.game
    if (!currentGame) throw new Error('No current game set')

    return currentGame
  }

  getCurrentGameMetaData = () => {
    const metaData = this.currentGameMetaData
    if (!metaData) {
      throw new Error('No current meta data set')
    }

    return metaData
  }

  addGame = (game?: Game) => {
    const currentGame =
      game ?? getEmptyGame({ id: (this.games.length + 1).toString() })
    this.games.push(currentGame)
    this.currentGameMetaData = {
      game: currentGame,
      currentInning: 0,
      subCache: []
    }
  }

  receiveGame = (game: string[]) => {
    game.forEach(this.receiveGameEvent)
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
