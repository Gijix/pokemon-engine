import { getPokemon } from "./api.js"
import { PokemonInBattle } from "./battle/pokemon.js"
import { TypeEnum } from "./pokemonType.js"
import { IPokemon, IntRange } from "./type.js"

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
  movepool: string[]
  abilities: string[]
  baseStat: StatDict
}

export class Pokemon {
  static async create (name: string) {
    const data = await getPokemon(name.toLowerCase())
    return new this(this.convert(data))
  }

  static convert (data: IPokemon): PokemonOptions {
    return {
      types: data.types.map((type) => type.type.name) as PokemonTypes,
      movepool: data.moves.map((move) => move.move.name.replace('-', ' ')),
      abilities: data.abilities.map(ability => ability.ability.name.replace('-', ' ')),
      baseStat: data.stats.reduce((acc, stat) => {
        const name = stat.stat.name as keyof typeof convertDict
        acc[convertDict[name]] = stat.base_stat
        return acc
      }, {} as StatDict)
    }
  }

  readonly baseStat: StatDict
  readonly movepool: string[]
  readonly abilities : string[]
  types: PokemonTypes
  protected constructor (options: PokemonOptions) {
    this.baseStat = options.baseStat
    this.types = options.types
    this.movepool = options.movepool
    this.abilities = options.abilities
  }
}
