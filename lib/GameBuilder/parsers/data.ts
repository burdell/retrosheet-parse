import { GameBuilder } from '..'

export function parseData(gameBuilder: GameBuilder, event: string[]) {
  const [eventType, dataField, playerId, dataValue] = event
  const { data } = gameBuilder.getCurrentGame()

  const earnedRunData = data.er
  if (dataField === 'er') {
    earnedRunData[playerId] = Number(dataValue)
  }
}
