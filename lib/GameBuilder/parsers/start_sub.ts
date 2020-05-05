import { GameBuilder } from '../../GameBuilder'

export function parseLineupEvent(gameBuilder: GameBuilder, event: string[]) {
  const { lineup, play } = gameBuilder.getCurrentGame()

  const [
    type,
    playerId,
    playerName,
    homeOrAway,
    lineupPosition,
    fieldPosition
  ] = event

  const isVisiting = homeOrAway === '0'
  const lineupType = isVisiting ? lineup.visiting : lineup.home
  const gameplay = isVisiting ? play.visiting : play.home
  const currentInning = gameplay.length

  const playerType = type === 'start' ? 'start' : 'sub'

  const lineupIndex = Number(lineupPosition) - 1
  if (!lineupType[lineupIndex]) lineupType[lineupIndex] = []

  lineupType[lineupIndex].push({
    id: playerId,
    name: playerName.replace(/['"]+/g, ''),
    position: Number(fieldPosition),
    type: playerType,
    inningEntered: playerType === 'start' ? 1 : currentInning
  })
}
