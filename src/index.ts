import { getPokemon } from "./api.js"
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

export class Pokemon {
  static async create (name: string) {
    const data = await getPokemon(name.toLowerCase())
    return new this(data)
  }

  readonly baseStat: StatDict
  readonly movepool: string[]
  readonly abilities : string[]
  types: PokemonTypes
  protected constructor (data: IPokemon) {
    this.baseStat = data.stats.reduce((acc, stat) => {
      const name = stat.stat.name as keyof typeof convertDict
      acc[convertDict[name]] = stat.base_stat
      return acc
    }, {} as StatDict)
    this.types = data.types.map((type) => type.type.name) as PokemonTypes
    this.movepool = data.moves.map((move) => move.move.name.replace('-', ' '))
    this.abilities = data.abilities.map(ability => ability.ability.name.replace('-', ' '))
  }
}
