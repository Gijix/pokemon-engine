import { getPokemon, getSpecies } from "./api.js"
import { PokemonInBattle } from "./battle/pokemon.js"
import { TypeEnum } from "./pokemonType.js"
import { IPokemon, PokemonSpecies } from "./type.js"

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
  baseStat: StatDict,
  hasGender: boolean
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
      movepool: pokemon.moves.map((move) => move.move.name.replace('-', ' ')),
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
  readonly movepool: string[]
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
