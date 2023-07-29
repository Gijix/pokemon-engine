import { getPokemon, getSpecies } from "./api.js"
import { MoveEnum, moves } from "./move/index.js"
import { Move } from "./move/constructor.js"
import { Nature, NatureEnum, natureDict } from "./nature.js"
import { TypeEnum } from "./pokemonType.js"
import { IPokemon, IntRange, PokemonSpecies } from "./type.js"
import { validate } from "./decorator.js"

const convertDict = {
  'speed': 'spe',
  'hp': 'hp',
  'attack': 'atk',
  'defense': 'def',
  'special-attack': 'spAtk',
  'special-defense': 'spDef',
} as const

export type StatsKey = 'hp' | 'atk' | 'def' | 'spAtk' | 'spDef' | 'spe'

export type StatDict<S extends Number = number> = Record<StatsKey, S>
export type PokemonTypes = [TypeEnum] | [TypeEnum, TypeEnum]

interface PokemonOptions {
  types: PokemonTypes
  movepool: Move[]
  abilities: string[]
  baseStat: StatDict,
  hasGender: boolean
}

export interface MoveDict {
  1: Move
  2: Move
  3: Move
  4: Move
}

export class Pokemon {
  static async create (name: string) {
    const data = await Promise.all([getPokemon(name.toLowerCase()), getSpecies(name.toLowerCase())])
    
    return new this(this.convert(...data))
  }

  static convert (pokemon: IPokemon, species: PokemonSpecies): PokemonOptions {
    return {
      hasGender: (species.gender_rate  !== -1),
      types: pokemon.types.map((type) => type.type.name) as PokemonTypes,
      movepool: pokemon.moves.map((move) => moves[(move.move.name.replace('-', ' ') as MoveEnum)]),
      abilities: pokemon.abilities.map(ability => ability.ability.name.replace('-', ' ')),
      baseStat: pokemon.stats.reduce((acc, stat) => {
        const name = stat.stat.name as keyof typeof convertDict
        acc[convertDict[name]] = stat.base_stat
        return acc
      }, {} as StatDict)
    }
  }

  readonly hasGender: boolean
  readonly baseStat: StatDict
  readonly movepool: Move[]
  readonly abilities : string[]
  readonly types: PokemonTypes
  protected constructor (options: PokemonOptions) {
    this.baseStat = options.baseStat
    this.types = options.types
    this.movepool = options.movepool
    this.abilities = options.abilities
    this.hasGender = options.hasGender
  }
}

export class PokemonSetup extends Pokemon {
  constructor (pokemon: Pokemon) {
    super(pokemon) 
  }
  nature: Nature = natureDict[NatureEnum.SERIOUS]
  moves: Partial<MoveDict> = {}

  @validate({
    max: 100,
    min: 1,
    msg: value => `invalid level value ${value}`
  })
  level = 100

  setMove (slot: 1 | 2 | 3 | 4, newMove: MoveEnum) {
    if (!this.movepool.some(move =>  move.name === newMove)) {
      throw new Error('invalid move') 
    }

    this.moves[slot] = moves[newMove]

    return this
  }

  private totalEv (evs?: StatDict): number {
    return Object.values(evs || this.evs).reduce((a,b) => a + b, 0) 
  }

  private _evs: StatDict<IntRange<0,253>> = {
    hp: 0,
    atk: 0,
    def: 0,
    spAtk: 0,
    spDef: 0,
    spe: 0
  }

  @validate({
    max: 31,
    min: 0,
    msg: (value) => `invalid iv value ${value}`
  })
  ivs: StatDict<IntRange<0, 32>> = {
    hp: 31,
    atk: 31,
    def: 31,
    spAtk: 31,
    spDef: 31,
    spe: 31
  }

  get evs () {
    return this._evs
  }

  setEv (key: StatsKey, value: IntRange<0, 253>) {
    const copy = {...this._evs}
    copy[key] = value

    if (this.totalEv(copy) > 512) {
      throw new Error("pokemon can't have more than 512 evs")
    }

    this._evs = copy

    return this
  }
}
