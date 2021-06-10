import { GameBuilder } from '../../GameBuilder'

export function parseLineupEvent(gameBuilder: GameBuilder, event: string[]) {
  const { lineup, play, pitchers } = gameBuilder.getCurrentGame()

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

  const playerType: 'start' | 'sub' = type === 'start' ? 'start' : 'sub'

  const lineupIndex = Number(lineupPosition) - 1

  const player = {
    id: playerId,
    name: playerName.replace(/["]+/g, ''),
    position: Number(fieldPosition),
    type: playerType,
    inningEntered: playerType === 'start' ? 1 : currentInning
  }
  const isHitter = lineupIndex >= 0
  const isPitcher = player.position === 1

  if (isHitter) {
    const lineupType = isVisiting ? lineup.visiting : lineup.home
    if (!lineupType[lineupIndex]) lineupType[lineupIndex] = []

    lineupType[lineupIndex].push(player)
  }

  if (isPitcher) {
    const pitcherType = isVisiting ? pitchers.visiting : pitchers.home
    pitcherType.push(player)
  }
}
