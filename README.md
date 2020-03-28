# retrosheet-parser

retrosheet-parser is a library that parses [Retrosheet](https://www.retrosheet.org/) files.

# Installation

`npm i retrosheet-parse`

# Usage

retrosheet-parse exposes 2 main functions. Both take a relative path your Retrosheet file and a set of optional options to generate an output file which are

```ts
export type FileOptions = {
  outputPath?: string // where the generated file will be outputted
  filename?: string // what to name that file (defaults to result.txt)
}
```

If you don't provide the options, no file is generated

```ts
const { parseFile, parseGames } = require('retrosheet-parse')

const rawGames = await parseFile('./my/retrosheet/file')

const formattedGames = await parseGames('./my/retrosheet/file', {
  outputPath: './results',
  filename: 'games.txt'
})
```

## parseFile(pathtoFile, [options])

`pathToFile`: relative path to your Retrosheet file

`options`: Optional options array (see below for availble option)

Takes a standard Retrosheet file and returns a list of raw games files. For example this (very) truncated file:

```
id,ANA201904040
version,2
info,visteam,TEX
start,choos001,"Shin-Soo Choo",0,1,9
start,harvm001,"Matt Harvey",1,0,1
play,1,0,choos001,22,FBBCH,HP
com,"On-field Delay"
data,er,volqe001,2
id,ANA201904040
version,2
info,visteam,TEX
start,choos001,"Shin-Soo Choo",0,1,9
start,harvm001,"Matt Harvey",1,0,1
play,1,0,choos001,22,FBBCH,HP
com,"On-field Delay"
data,er,volqe001,2
```

will return an array with 2 game arrays in it:

```
[
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
```

## parseGames(pathtoFile, [options])

`pathToFile`: relative path to your Retrosheet file

`options`: Optional options array (see below for availble option)

Parses a Retrosheet file but returns a promise that resolves a list of Game objects. Type definitions for returned data:

```ts
type Player = {
  id: string
  name: string
  position: number
  type: 'sub' | 'start'
}

type Comment = {
  type: 'comment'
  text: string
}

type AtBat = {
  type: 'at-bat'
  playerId: string
  count: string
  pitchSequence: string
  result: string
}

type GameplayEvent = AtBat | Comment

type Lineup = Player[][]

type Game = {
  id: string
  info: {
    visteam: string
    hometeam: string
    site: string
    date: string
    number: string
    starttime: string
    daynight: string
    usedh: string
    umphome: string
    ump1b: string
    ump2b: string
    ump3b: string
    howscored: string
    pitches: string
    oscorer: string
    temp: string
    winddir: string
    windspeed: string
    fieldcond: string
    precip: string
    sky: string
    timeofgame: string
    attendance: string
    wp: string
    lp: string
    save: string
  }
  version: string
  lineup: {
    home: Lineup
    visiting: Lineup
  }
  data: {
    er: {
      [playerId: string]: number
    }
  }
  play: {
    home: GameplayEvent[][]
    visiting: GameplayEvent[][]
  }
}
```

# Development

This project is still very rough and new. Also the fact that you know what Retrosheet files are and also what npm is means you could be very valuable to its development, so feel free to contribute or submit issues for improvement!
