import { GameBuilder } from '../../GameBuilder'
import { getEmptyGame } from '../getEmptyGame'

export function parseNewGame(gameBuilder: GameBuilder, event: string[]) {
  const game = getEmptyGame({ id: event[1] })
  gameBuilder.addGame(game)
}
