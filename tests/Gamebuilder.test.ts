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
      type: 'start',
      inningEntered: 1
    }
    const awayPlayer2 = {
      id: 'bryak001',
      name: 'Kris Bryant',
      position: 5,
      type: 'start',
      inningEntered: 1
    }
    const homePlayer1 = {
      id: 'incie001',
      name: 'Ender Inciarte',
      position: 8,
      type: 'start',
      inningEntered: 1
    }
    const homePlayer2 = {
      id: 'donaj001',
      name: 'Josh Donaldson',
      position: 5,
      type: 'start',
      inningEntered: 1
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
      type: 'start',
      inningEntered: 1
    }
    const awaySubstitute = {
      id: 'bryak001',
      name: 'Kris Bryant',
      position: 5,
      type: 'sub',
      inningEntered: 0
    }

    const homeStarter = {
      id: 'newcs001',
      name: 'Sean Newcomb',
      position: 1,
      type: 'start',
      inningEntered: 1
    }
    const homeSubstitute = {
      id: 'biddj001',
      name: 'Jesse Biddle',
      position: 1,
      type: 'sub',
      inningEntered: 0
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

  it('records runner adjustments', () => {
    const gb = new GameBuilder()
    gb.addGame()

    gb.receiveGameEvent('start,dickc002,Corey Dickerson,0,1,7')
    gb.receiveGameEvent('start,marts002,Starling Marte,0,2,8')
    gb.receiveGameEvent('start,aguij001,Jesus Aguilar,0,3,3')
    gb.receiveGameEvent('start,joycm001,Matt Joyce,0,4,9')
    gb.receiveGameEvent('start,coopg002,Garrett Cooper,0,5,10')
    gb.receiveGameEvent('start,bertj001,Jon Berti,0,6,5')
    gb.receiveGameEvent('start,chisj001,Jazz Chisholm,0,7,4')
    gb.receiveGameEvent('start,rojam002,Miguel Rojas,0,8,6')
    gb.receiveGameEvent('start,alfaj002,Jorge Alfaro,0,9,2')
    gb.receiveGameEvent('start,urenj001,Jose Urena,0,0,1')
    gb.receiveGameEvent('start,acunr001,Ronald Acuna Jr.,1,1,9')
    gb.receiveGameEvent('start,swand001,Dansby Swanson,1,2,6')
    gb.receiveGameEvent('start,freef001,Freddie Freeman,1,3,3')
    gb.receiveGameEvent('start,ozunm001,Marcell Ozuna,1,4,10')
    gb.receiveGameEvent(`start,darnt001,Travis d'Arnaud,1,5,2`)
    gb.receiveGameEvent('start,markn001,Nick Markakis,1,6,7')
    gb.receiveGameEvent('start,rilea001,Austin Riley,1,7,5')
    gb.receiveGameEvent('start,hecha001,Adeiny Hechavarria,1,8,4')
    gb.receiveGameEvent('start,incie001,Ender Inciarte,1,9,8')
    gb.receiveGameEvent('start,andei001,Ian Anderson,1,0,1')
    gb.receiveGameEvent('play,1,0,dickc002,11,FBX,53/G56S-')
    gb.receiveGameEvent('play,1,0,marts002,01,CX,8/F89')
    gb.receiveGameEvent('play,1,0,aguij001,31,BCBBB,W')
    gb.receiveGameEvent('play,1,0,joycm001,22,BCBSX,46(1)/FO/G4.B-1')
    gb.receiveGameEvent('play,1,1,acunr001,31,BBBFB,W')
    gb.receiveGameEvent('play,1,1,swand001,10,B1>B,SB2.1-3(E2/TH)')
    gb.receiveGameEvent('play,1,1,swand001,31,B1>B.BFB,W')
    gb.receiveGameEvent('play,1,1,freef001,10,BX,D8/L78XD+.3-H;1-H')
    gb.receiveGameEvent('play,1,1,ozunm001,12,BCFS,K')
    gb.receiveGameEvent('play,1,1,darnt001,00,2X,S7/G56.2-3')
    gb.receiveGameEvent('play,1,1,markn001,30,BBBX,46(1)3/GDP/G4')
    gb.receiveGameEvent('play,2,0,bertj001,00,.,NP')
    gb.receiveGameEvent('sub,markn001,Nick Markakis,1,6,9')
    gb.receiveGameEvent('play,2,0,bertj001,00,..,NP')
    gb.receiveGameEvent('sub,duvaa001,Adam Duvall,1,9,7')
    gb.receiveGameEvent('play,2,0,bertj001,00,...,NP')
    gb.receiveGameEvent('sub,minta001,A.J. Minter,1,0,1')
    gb.receiveGameEvent('radj,acunr001,2')
    gb.receiveGameEvent('radj,coopg002,2')
    gb.receiveGameEvent('play,2,0,aguij001,31,BCBBB,W')
    gb.receiveGameEvent('play,2,1,swand001,10,B1>B,SB2.1-3(E2/TH)')

    // inning with subs
    const visitingGameplay = gb.getCurrentGame().play.visiting
    const inning = visitingGameplay[1]
    expect(inning[inning.length - 2]).toEqual({
      base: 2,
      playerId: 'coopg002',
      type: 'runner-adjustment'
    })

    //inning with no subs
    const homeGameplay = gb.getCurrentGame().play.home
    expect(homeGameplay[1][0]).toEqual({
      base: 2,
      playerId: 'acunr001',
      type: 'runner-adjustment'
    })
  })

  it('does nothing if it encounters an event it doesnt know about', () => {
    const gb = new GameBuilder()
    gb.addGame()

    gb.receiveGameEvent('lol,not,an,event')
  })
})
