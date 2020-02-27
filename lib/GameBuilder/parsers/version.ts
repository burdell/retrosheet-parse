import { GameBuilder } from '..'

export function parseVersion(gameBuilder: GameBuilder, event: string[]) {
  const [eventType, version] = event
  const game = gameBuilder.getCurrentGame()

  game.version = version
}
