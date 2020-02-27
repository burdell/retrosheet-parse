import { GameBuilder } from '../../GameBuilder'

export function parseLineupEvent(gameBuilder: GameBuilder, event: string[]) {
  const { lineup } = gameBuilder.getCurrentGame()

  const [
    type,
    playerId,
    playerName,
    homeOrAway,
    lineupPosition,
    fieldPosition
  ] = event

  const lineupType = homeOrAway === '0' ? lineup.visiting : lineup.home
  const playerType = type === 'start' ? 'start' : 'sub'

  const lineupIndex = Number(lineupPosition) - 1
  if (!lineupType[lineupIndex]) lineupType[lineupIndex] = []

  lineupType[lineupIndex].push({
    id: playerId,
    name: playerName.replace(/['"]+/g, ''),
    position: Number(fieldPosition),
    type: playerType
  })
}
