import { StatsKey } from "."

export enum NatureEnum {
  HARDY = 'hardy',
  LONELY = 'lonely',
  BRAVE = 'brave',
  ADAMANT = 'adamant',
  NAUGHTY = 'naughty',
  BOLD = 'bold',
  DOCILE = 'docile',
  RELAXED = 'relaxed',
  IMPISH = 'impish',
  LAX = 'lax',
  TIMID = 'timid',
  HASTY = 'hasty',
  SERIOUS = 'serious',
  JOLLY = 'jolly',
  NAIVE = 'naive',
  MODEST = 'modest',
  MILD = 'mild',
  QUIET = 'quiet',
  BASHFUL = 'bashful',
  RASH = 'rash',
  CALM = 'calm',
  GENTLE = 'gentle',
  SASSY = 'sassy',
  CAREFUL = 'careful',
  QUIRKY = 'quirky'
}

interface Nature {
  name: NatureEnum
  increaseStat?: StatsKey
  decreaseStat?: StatsKey
}

const {HARDY,LONELY,BRAVE,ADAMANT,NAUGHTY,BOLD,DOCILE,RELAXED,IMPISH,LAX,TIMID,HASTY,SERIOUS,JOLLY,NAIVE,MODEST,MILD,QUIET,BASHFUL,RASH,CALM,GENTLE,SASSY,CAREFUL,QUIRKY} = NatureEnum

export const natureDict: Record<NatureEnum, Nature> = {
  [HARDY]: {
    name: HARDY,
  },
  [LONELY]: {
    name: LONELY,
    increaseStat: 'atk',
    decreaseStat: 'def'
  },
  [BRAVE]: {
    name: BRAVE,
    increaseStat: 'atk',
    decreaseStat: 'spe',
  },
  [ADAMANT]: {
    name: ADAMANT,
    increaseStat: 'atk',
    decreaseStat: 'spAtk'
  },
  [NAUGHTY]: {
    name: NAUGHTY,
    increaseStat: 'atk',
    decreaseStat: 'spDef'
  },
  [BOLD]: {
    name: BOLD,
    increaseStat: 'atk'
  },
  [DOCILE]: {
    name: DOCILE,
  },
  [RELAXED]: {
    name: RELAXED,
    increaseStat: 'def',
    decreaseStat: 'spe'
  },
  [IMPISH]: {
    name: IMPISH,
    increaseStat: 'def',
    decreaseStat: 'spAtk'
  },
  [LAX]: {
    name: LAX,
    increaseStat: 'def',
    decreaseStat: 'spDef',
  },
  [TIMID]: {
    name: TIMID,
    increaseStat: 'spe',
    decreaseStat: 'atk'
  },
  [HASTY]: {
    name: HASTY,
    increaseStat: 'spe',
    decreaseStat: 'def',
  },
  [SERIOUS]: {
    name: SERIOUS,
  },
  [JOLLY]: {
    name: JOLLY,
    increaseStat: 'spe',
    decreaseStat: 'spAtk'
  },
  [NAIVE]: {
    name: NAIVE,
    increaseStat: 'spe',
    decreaseStat: 'spDef'
  },
  [MODEST]: {
    name: MODEST,
    increaseStat: 'spAtk',
    decreaseStat: 'atk'
  },
  [QUIET]: {
    name: QUIET,
    increaseStat: 'spAtk',
    decreaseStat: 'spe'
  },
  [MILD]: {
    name: MILD,
    increaseStat: 'spAtk',
    decreaseStat: 'def'
  },
  [BASHFUL]: {
    name: BASHFUL,
  },
  [RASH]: {
    name: RASH,
    increaseStat: 'spAtk',
    decreaseStat: 'spDef'
  },
  [CALM]: {
    name: CALM,
    increaseStat: 'spDef',
    decreaseStat: 'atk'
  },
  [GENTLE]: {
    name: GENTLE,
    increaseStat: 'spDef',
    decreaseStat: 'def',
  },
  [SASSY]: {
    name: SASSY,
    increaseStat: 'spDef',
    decreaseStat: 'spe'
  },
  [CAREFUL]: {
    name: CAREFUL,
    increaseStat: 'spDef',
    decreaseStat: 'atk'
  },
  [QUIRKY]: {
    name: QUIRKY,
  },
}
