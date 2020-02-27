import { readFile } from 'fs'
import { resolve, relative } from 'path'
import { promisify } from 'util'

import { GameBuilder } from './GameBuilder'

const readFileAsync = promisify(readFile)

export async function parseFileContent(filePath: string) {
  try {
    const rawContent = await readFileAsync(resolve(process.cwd(), filePath), {
      encoding: 'utf8'
    })

    return rawContent.split('\n').filter(c => !!c)
  } catch (e) {
    throw new Error('There was an error reading your file.')
  }
}

export async function getGames(filePath: string) {
  const gameBuilder = new GameBuilder()

  const gameEvents = await parseFileContent(filePath)
  gameEvents.forEach(gameBuilder.receiveGameEvent)

  return gameBuilder.getGames()
}
