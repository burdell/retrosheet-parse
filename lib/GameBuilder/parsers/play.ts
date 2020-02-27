import { AtBat } from '../../types'
import { GameBuilder } from '..'

export function parsePlayEvent(gameBuilder: GameBuilder, event: string[]) {
  const [
    eventType,
    inning,
    homeOrAway,
    playerId,
    count,
    pitchSequence,
    result
  ] = event
  const game = gameBuilder.getCurrentGame()
  const gameplay = homeOrAway === '0' ? game.play.visiting : game.play.home

  const atBat: AtBat = {
    count,
    playerId,
    result,
    pitchSequence,
    type: 'at-bat'
  }
  const inningIndex = Number(inning) - 1
  if (!gameplay[inningIndex]) {
    gameplay[inningIndex] = []
  }

  gameplay[inningIndex].push(atBat)
}
