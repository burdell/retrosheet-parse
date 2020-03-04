import { parseFile, parseGames } from '../lib/index'

describe('lib', () => {
  it('parses a raw file', async () => {
    const result = await parseFile('./tests/testfile2')

    expect(result).toEqual([
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
    ])
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

  it('parses a game', async () => {
    const games = await parseGames('./tests/testfile')

    const game = games[0]

    expect(JSON.parse(JSON.stringify(game))).toMatchObject({
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
              type: 'start'
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
    })
  })
})
