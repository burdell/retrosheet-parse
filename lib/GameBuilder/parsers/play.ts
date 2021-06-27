import { AtBat, Game, GameMetaData } from '../../types'
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
  const gameMetaData = gameBuilder.getCurrentGameMetaData()
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
  emptySubCache(inningIndex, gameMetaData)
}

function emptySubCache(inningIndex: number, gameMetaData: GameMetaData) {
  const subCache = gameMetaData.subCache
  if (subCache.length === 0) {
    return
  }

  const currentGame = gameMetaData.game
  const lineup = currentGame.lineup
  const pitchers = currentGame.pitchers

  subCache.forEach((cache) => {
    const { teamType, player } = cache
    const isVisiting = teamType === 'visiting'
    if (cache.playerType === 'hitter') {
      const teamLineup = isVisiting ? lineup.visiting : lineup.home
      const lineupIndex = cache.lineupIndex
      if (!teamLineup[lineupIndex]) teamLineup[lineupIndex] = []
      teamLineup[lineupIndex].push({
        ...player,
        inningEntered: inningIndex + 1
      })
    } else {
      const pitcherType = isVisiting ? pitchers.visiting : pitchers.home
      pitcherType.push({ ...player, inningEntered: inningIndex + 1 })
    }
  })
}
