import { getGames, parseFileContent } from './getGames'
import { writeToFile } from './file-utils/writeToFile'
import { FileOptions } from './types'

export async function parseGames(pathToFile: string, options?: FileOptions) {
  const games = await getGames(pathToFile)

  const { outputPath, filename = 'result.txt' } = options || {}
  if (outputPath) {
    writeToFile(games, outputPath, filename)
  }
  return games
}

export async function parseFile(pathToFile: string, options?: FileOptions) {
  const content = await parseFileContent(pathToFile)
  const { outputPath, filename = 'result.txt' } = options || {}
  if (outputPath) {
    writeToFile(content, outputPath, filename)
  }

  return content
}
