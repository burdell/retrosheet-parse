import { EventType, GameInfo } from '../../types'
import { GameBuilder } from '..'

export function parseGameInfo(gameBuilder: GameBuilder, event: string[]) {
  const [eventType, key, value] = event
  const { info } = gameBuilder.getCurrentGame()
  info[key as keyof GameInfo] = value
}
