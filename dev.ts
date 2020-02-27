import { parseFile } from './lib/index'

async function main() {
  const result = await parseFile('./tests/testfile')

  console.log(result)
}

main()
