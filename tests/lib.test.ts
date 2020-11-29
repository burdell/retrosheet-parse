import { writeFile } from 'fs'
import { parseFile, parseGames } from '../lib/index'
import * as fs from 'fs'
import { resolve } from 'path'

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  writeFileSync: jest.fn()
}))

const testFile2Results = [
  [
    'id,ANA201904040',
    'version,2',
    'info,visteam,TEX',
    'start,choos001,"Shin-Soo Choo",0,1,9',
    'start,harvm001,"Matt Harvey",1,0,1',
    'play,1,0,choos001,22,FBBCH,HP',
    'com,"On-field Delay"',
    'data,er,volqe001,2'
  ],
  [
    'id,ANA201904040',
    'version,2',
    'info,visteam,TEX',
    'start,choos001,"Shin-Soo Choo",0,1,9',
    'start,harvm001,"Matt Harvey",1,0,1',
    'play,1,0,choos001,22,FBBCH,HP',
    'com,"On-field Delay"',
    'data,er,volqe001,2'
  ]
]

const testFileJsonResults = {
  id: 'ANA201904040',
  version: '2',
  lineup: {
    home: [],
    visiting: [
      [
        {
          id: 'choos001',
          name: 'Shin-Soo Choo',
          position: 9,
          type: 'start',
          inningEntered: 1
        }
      ]
    ]
  },
  info: {
    visteam: 'TEX',
    hometeam: '',
    site: '',
    date: '',
    number: '',
    starttime: '',
    daynight: '',
    usedh: '',
    umphome: '',
    ump1b: '',
    ump2b: '',
    ump3b: '',
    howscored: '',
    pitches: '',
    oscorer: '',
    temp: '',
    winddir: '',
    windspeed: '',
    fieldcond: '',
    precip: '',
    sky: '',
    timeofgame: '',
    attendance: '',
    wp: '',
    lp: '',
    save: ''
  },
  data: {
    er: {
      volqe001: 2
    }
  },
  play: {
    home: [],
    visiting: [
      [
        {
          count: '22',
          playerId: 'choos001',
          result: 'HP',
          pitchSequence: 'FBBCH',
          type: 'at-bat'
        }
      ]
    ]
  }
}

describe('lib', () => {
  beforeEach(() => {
    ;(fs.writeFileSync as any).mockClear()
  })

  it('parses a raw file', async () => {
    const result = await parseFile('./tests/testfile2')

    expect(fs.writeFileSync).not.toHaveBeenCalled()
    expect(result).toEqual(testFile2Results)
  })

  it('parses a game', async () => {
    const games = await parseGames('./tests/testfile')

    expect(fs.writeFileSync).not.toHaveBeenCalled()
    const game = games[0]
    expect(JSON.parse(JSON.stringify(game))).toMatchObject(testFileJsonResults)
  })

  it('writes results to file with parseFile', async () => {
    const filename = 'my_results.txt'
    const outputPath = './some-directory'
    await parseFile('./tests/testfile2', {
      filename,
      outputPath
    })

    const resolvedPath = `${resolve(process.cwd(), outputPath)}/${filename}`
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      resolvedPath,
      JSON.stringify(testFile2Results, null, 2)
    )
  })

  it('writes results to file with parseGames', async () => {
    const filename = 'my_results.txt'
    const outputPath = './some-directory'
    await parseGames('./tests/testfile', {
      filename,
      outputPath
    })

    const resolvedPath = `${resolve(process.cwd(), outputPath)}/${filename}`
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      resolvedPath,
      JSON.stringify([testFileJsonResults], null, 2)
    )
  })

  it('handles file errors', async () => {
    try {
      await parseFile('./not/a/file')
    } catch (e) {
      expect(e.message).toEqual('There was an error reading your file.')
    }
  })

  it('handles invalid files', async () => {
    try {
      await parseFile('./tests/testfile3')
    } catch (e) {
      expect(e.message).toEqual(
        'Invalid game data: Attempted to add game event without current game.'
      )
    }
  })
})
