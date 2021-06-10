import { GameplayEvent } from '../types'

export function inningHasAction(inning: GameplayEvent[]) {
  return inning.some((i) => i.type === 'at-bat' && i.result !== 'NP')
}
