import { MoveEnum, MoveExecute } from "./index.js"
import type { GameState } from "../battle/index.js"
import type { SecondaryEffect, StatsChange } from "../effect.js"
import type { TypeEnum } from "../pokemonType.js"
import type { PokemonInBattle } from "../battle/pokemon.js"


export type MoveCategory = 'special' | 'status' | 'physical'

export interface MoveOptions {
  name: MoveEnum
  type: TypeEnum
  category: MoveCategory
  power?: number
  accuracy?: number
  pp: number
  attributs?: MoveAttributs
  effect?(this: GameState, move: MoveExecute): void
  init? (this: GameState, move: MoveExecute): void
}

export interface MoveAttributs {
  isContact?: boolean
  isMissable?: boolean
  lifeSteal?: number
  selfTarget?: boolean
  statsChange?: StatsChange[]
  priority?: number
  ignoreSleeping?: boolean
  recoil?: number,
  secondaryEffect?: SecondaryEffect[]
}

export interface RequiredOptions {
  priority: number
}

export class Move {
  name: MoveEnum
  type: TypeEnum
  category: MoveCategory
  power: number
  accuracy: number
  pp: number
  attributs: MoveAttributs & RequiredOptions = {
    priority: 0
  }
  init?: (this: GameState, move: MoveExecute) => void
  effect?: (this: GameState, move: MoveExecute) => void 
  constructor (options: MoveOptions) {
    const { type, category, power, accuracy, attributs, name, effect, pp, init } = options
    this.name = name
    this.type = type
    this.category = category
    this.power = power || 0
    this.accuracy = accuracy || 0
    if (attributs) {
      this.attributs = {...this.attributs, ...attributs}
    }
    this.pp = pp
    this.effect = effect
    this.init = init
  }

  execute (this: this, executor: PokemonInBattle, target?: PokemonInBattle) {
    if (this.constructor.name !== 'Move') {
      throw new Error('move already execute')
    }
    return new MoveExecute(this, {executor, target})
  }
}