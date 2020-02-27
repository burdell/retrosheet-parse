import { GameBuilder, getEmptyGame } from '../lib/GameBuilder'

describe('Game Builder', () => {
  it('adds new games without a parameter', () => {
    const gb = new GameBuilder()
    gb.addGame()

    expect(gb.getGames().length).toEqual(1)
    expect(gb.getCurrentGame().id).toEqual('1')

    gb.addGame()

    expect(gb.getGames().length).toEqual(2)
    expect(gb.getCurrentGame().id).toEqual('2')
  })

  it('adds new games with a parameter', () => {
    const gb = new GameBuilder()
    const id1 = '1'
    gb.addGame(getEmptyGame({ id: id1 }))

    expect(gb.getGames().length).toEqual(1)
    expect(gb.getCurrentGame().id).toEqual(id1)

    const id2 = '2'
    gb.addGame(getEmptyGame({ id: id2 }))

    expect(gb.getGames().length).toEqual(2)
    expect(gb.getCurrentGame().id).toEqual(id2)
  })

  it('sets the id', () => {
    const gb = new GameBuilder()
    const id = 'ANA201904040'

    gb.addGame()
    gb.receiveGameEvent(`id,${id}`)

    expect(gb.getCurrentGame().id).toEqual(id)
  })

  it('sets the Retrosheet version', () => {
    const gb = new GameBuilder()
    const versionNumber = '2'

    gb.addGame()
    gb.receiveGameEvent(`version,${versionNumber}`)

    expect(gb.getCurrentGame().version).toEqual(versionNumber)
  })

  it('sets the game info', () => {
    const gb = new GameBuilder()
    gb.addGame()

    const visteam = 'CHN'
    const hometeam = 'ATL'
    const site = 'ATL03'
    const date = '2019/04/01'

    gb.receiveGameEvent(`info,visteam,${visteam}`)
    gb.receiveGameEvent(`info,hometeam,${hometeam}`)
    gb.receiveGameEvent(`info,site,${site}`)
    gb.receiveGameEvent(`info,date,${date}`)

    const { info } = gb.getCurrentGame()

    expect(info.visteam).toEqual(visteam)
    expect(info.hometeam).toEqual(hometeam)
    expect(info.site).toEqual(site)
    expect(info.date).toEqual(date)
  })

  it('sets the lineups', () => {
    const gb = new GameBuilder()
    gb.addGame()

    const awayPlayer1 = {
      id: 'almoa002',
      name: 'Albert Almora',
      position: 8,
      type: 'start'
    }
    const awayPlayer2 = {
      id: 'bryak001',
      name: 'Kris Bryant',
      position: 5,
      type: 'start'
    }
    const homePlayer1 = {
      id: 'incie001',
      name: 'Ender Inciarte',
      position: 8,
      type: 'start'
    }
    const homePlayer2 = {
      id: 'donaj001',
      name: 'Josh Donaldson',
      position: 5,
      type: 'start'
    }

    gb.receiveGameEvent(
      `start,${awayPlayer1.id},"${awayPlayer1.name}",0,1,${awayPlayer1.position}`
    )
    gb.receiveGameEvent(
      `start,${awayPlayer2.id},"${awayPlayer2.name}",0,2,${awayPlayer2.position}`
    )
    gb.receiveGameEvent(
      `start,${homePlayer1.id},"${homePlayer1.name}",1,1,${homePlayer1.position}`
    )
    gb.receiveGameEvent(
      `start,${homePlayer2.id},"${homePlayer2.name}",1,2,${homePlayer2.position}`
    )

    const { lineup } = gb.getCurrentGame()

    expect(lineup.visiting[0]).toEqual([awayPlayer1])
    expect(lineup.visiting[1]).toEqual([awayPlayer2])
    expect(lineup.home[0]).toEqual([homePlayer1])
    expect(lineup.home[1]).toEqual([homePlayer2])
  })

  it('sets the ER data', () => {
    const gb = new GameBuilder()
    gb.addGame()

    const player1 = { id: 'lopep002', value: 4 }
    const player2 = { id: 'kinlt001', value: 0 }

    gb.receiveGameEvent(`data,er,${player1.id},${player1.value}`)
    gb.receiveGameEvent(`data,er,${player2.id},${player2.value}`)

    const { data } = gb.getCurrentGame()

    expect(data.er[player1.id]).toEqual(player1.value)
    expect(data.er[player2.id]).toEqual(player2.value)
  })

  it('handles data it doesnt understand', () => {
    const gb = new GameBuilder()
    gb.addGame()

    gb.receiveGameEvent(`data,not,real,data`)
  })

  it('sets substitutions', () => {
    const gb = new GameBuilder()
    gb.addGame()

    const awayStarter = {
      id: 'almoa002',
      name: 'Albert Almora',
      position: 5,
      type: 'start'
    }
    const awaySubstitute = {
      id: 'bryak001',
      name: 'Kris Bryant',
      position: 5,
      type: 'sub'
    }

    const homeStarter = {
      id: 'newcs001',
      name: 'Sean Newcomb',
      position: 1,
      type: 'start'
    }
    const homeSubstitute = {
      id: 'biddj001',
      name: 'Jesse Biddle',
      position: 1,
      type: 'sub'
    }

    const awaySubPosition = 5
    const homeSubPosition = 2

    gb.receiveGameEvent(
      `start,${awayStarter.id},"${awayStarter.name}",0,${awaySubPosition},${awayStarter.position}`
    )
    gb.receiveGameEvent(
      `sub,${awaySubstitute.id},"${awaySubstitute.name}",0,${awaySubPosition},${awaySubstitute.position}`
    )
    gb.receiveGameEvent(
      `start,${homeStarter.id},"${homeStarter.name}",1,${homeSubPosition},${homeStarter.position}`
    )
    gb.receiveGameEvent(
      `sub,${homeSubstitute.id},"${homeSubstitute.name}",1,${homeSubPosition},${homeSubstitute.position}`
    )

    const { lineup } = gb.getCurrentGame()

    expect(lineup.visiting[awaySubPosition - 1]).toEqual([
      awayStarter,
      awaySubstitute
    ])
    expect(lineup.home[homeSubPosition - 1]).toEqual([
      homeStarter,
      homeSubstitute
    ])
  })

  it('records at bats', () => {
    // play,3,1,markn001,00,X,8/L
    const gb = new GameBuilder()
    gb.addGame()

    const homeinning = '3'
    const homehomeOrAway = '1'
    const homeplayerId = 'acunr001'
    const homecount = '32'
    const homepitchSequence = 'CCBBBX'
    const homeresult = '3/G.2-3;1-2'

    const awayInning = '2'
    const awayHomeOrAway = '0'
    const awayPlayerId = 'deshd002'
    const awayCount = '02'
    const awayPitchSequence = 'CCBBBX'
    const awayresult = '3/G.2-3;1-2'

    gb.receiveGameEvent(
      `play,${homeinning},${homehomeOrAway},${homeplayerId},${homecount},${homepitchSequence},${homeresult}`
    )
    gb.receiveGameEvent(
      `play,${homeinning},${homehomeOrAway},${homeplayerId},${homecount},${homepitchSequence},${homeresult}`
    )

    gb.receiveGameEvent(
      `play,${awayInning},${awayHomeOrAway},${awayPlayerId},${awayCount},${awayPitchSequence},${awayresult}`
    )
    gb.receiveGameEvent(
      `play,${awayInning},${awayHomeOrAway},${awayPlayerId},${awayCount},${awayPitchSequence},${awayresult}`
    )

    const homeAtBat = {
      count: homecount,
      playerId: homeplayerId,
      result: homeresult,
      pitchSequence: homepitchSequence,
      type: 'at-bat'
    }

    const awayAtBat = {
      count: awayCount,
      playerId: awayPlayerId,
      result: awayresult,
      pitchSequence: awayPitchSequence,
      type: 'at-bat'
    }

    const game = gb.getCurrentGame()

    expect(game.play.home[Number(homeinning) - 1]).toEqual([
      homeAtBat,
      homeAtBat
    ])
    expect(game.play.visiting[Number(awayInning) - 1]).toEqual([
      awayAtBat,
      awayAtBat
    ])
  })

  it('does nothing if it encounters an event it doesnt know about', () => {
    const gb = new GameBuilder()
    gb.addGame()

    gb.receiveGameEvent('lol,not,an,event')
  })
})
