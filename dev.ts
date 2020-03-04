import { parseFileContent } from './lib/getGames'

async function main() {
  const result = await parseFileContent('./tests/testfile2')

  // console.log(result)
}

main()
