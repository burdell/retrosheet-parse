import { GameBuilder } from '../../GameBuilder'

export function parseLineupEvent(gameBuilder: GameBuilder, event: string[]) {
  const { lineup, play, pitchers } = gameBuilder.getCurrentGame()
  const { subCache } = gameBuilder.getCurrentGameMetaData()

  const [
    type,
    playerId,
    playerName,
    homeOrAway,
    lineupPosition,
    fieldPosition
  ] = event

  const isVisiting = homeOrAway === '0'
  const gameplay = isVisiting ? play.visiting : play.home
  const currentInning = gameplay.length

  const howPlayerEntering: 'start' | 'sub' = type === 'start' ? 'start' : 'sub'
  const lineupIndex = Number(lineupPosition) - 1
  const player = {
    id: playerId,
    name: playerName.replace(/["]+/g, ''),
    position: Number(fieldPosition),
    type: howPlayerEntering,
    inningEntered: howPlayerEntering === 'start' ? 1 : currentInning
  }
  const isHitter = lineupIndex >= 0
  const isPitcher = player.position === 1

  if (isHitter) {
    const lineupType = isVisiting ? lineup.visiting : lineup.home
    if (!lineupType[lineupIndex]) lineupType[lineupIndex] = []

    if (howPlayerEntering === 'start') {
      lineupType[lineupIndex].push(player)
    } else {
      subCache.push({
        playerType: 'hitter',
        lineupIndex,
        player,
        teamType: isVisiting ? 'visiting' : 'home'
      })
    }
  }

  if (isPitcher) {
    const pitcherType = isVisiting ? pitchers.visiting : pitchers.home
    if (howPlayerEntering === 'start') {
      pitcherType.push(player)
    } else {
      subCache.push({
        playerType: 'pitcher',
        player,
        teamType: isVisiting ? 'visiting' : 'home'
      })
    }
  }
}
