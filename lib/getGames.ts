import { readFile } from 'fs'
import { resolve } from 'path'
import { promisify } from 'util'

import { GameBuilder } from './GameBuilder'

const readFileAsync = promisify(readFile)

export async function parseFileContent(filePath: string) {
  try {
    const rawContent = await readFileAsync(resolve(process.cwd(), filePath), {
      encoding: 'utf8'
    })

    const games: string[][] = []
    rawContent.split('\n').forEach(line => {
      if (!line) return

      const [action] = line.split(',')
      if (action === 'id') {
        games.push([line])
        return
      }

      const currentGame = games[games.length - 1]
      if (!currentGame) {
        const error = new Error(
          'Invalid game data: Attempted to add game event without current game.'
        )
        error.name = 'InvalidData'
        throw error
      }

      currentGame.push(line)
    })

    return games
  } catch (e) {
    throw new Error(
      e.name === 'InvalidData'
        ? e.message
        : 'There was an error reading your file.'
    )
  }
}

export async function getGames(filePath: string) {
  const gameBuilder = new GameBuilder()

  const games = await parseFileContent(filePath)
  games.forEach(gameBuilder.receiveGame)

  return gameBuilder.getGames()
}
