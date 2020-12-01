import {
  RunnerAdjustment,
  Game,
  Lineup,
  AtBat,
  GameplayEvent
} from '../../types'
import { GameBuilder } from '..'

export function parseRunnerAdjustment(
  gameBuilder: GameBuilder,
  event: string[]
) {
  const [eventType, playerId, base] = event
  const game = gameBuilder.getCurrentGame()

  const runnerAdjustment: RunnerAdjustment = {
    type: 'runner-adjustment',
    playerId,
    base: Number(base)
  }

  const team = getTeam(game, playerId)
  const gameplay = game.play[team]

  // this assumes 'runner adjustment' is the always the extra inning runner
  // meaning it's always the first thing in the next inning
  let inningIndex = gameplay.length - 1
  const lastInning = gameplay[gameplay.length - 1]
  if (lastInning.length !== 0 && inningHasAction(lastInning)) {
    inningIndex += 1
    gameplay[inningIndex] = []
  }

  gameplay[inningIndex].push(runnerAdjustment)
}

function getTeam(game: Game, playerId: string) {
  if (hasPlayer(game.lineup.visiting, playerId)) {
    return 'visiting'
  }

  if (hasPlayer(game.lineup.home, playerId)) {
    return 'home'
  }

  throw new Error('Attempted a runner adjustment with an invalid player')
}

function inningHasAction(inning: GameplayEvent[]) {
  return inning.some((i) => i.type === 'at-bat' && i.result !== 'NP')
}

function getLineupPlayers(lineup: Lineup) {
  return lineup.flatMap((lineupSpot) => lineupSpot.map((p) => p))
}

function hasPlayer(lineup: Lineup, playerId: string) {
  const players = getLineupPlayers(lineup)
  return players.findIndex((p) => p.id === playerId) >= 0
}
