import { TypeEnum } from "../pokemonType.js";
import { GameState } from "../battle/index.js";
import { PokemonInBattle } from "../battle/pokemon.js";
import { NormalMoveEnum } from "./normal.js";
import { WaterMoveEnum } from "./water.js";
import { ElectricMoveEnum } from "./electric.js";
import { NatureEnum, natureDict } from "../nature.js";
import { getRandomInt } from "../util/math.js";

type MoveCategory = 'special' | 'status' | 'physical'

type MoveEnum = NormalMoveEnum  | WaterMoveEnum | ElectricMoveEnum

interface MoveAttributs {
  isContact?: boolean
  isMissable?: boolean
  lifeSteal?: number
  selfTarget?: boolean
}

interface MoveOptions {
  name: MoveEnum
  type: TypeEnum
  category: MoveCategory
  power: number
  precision: number
  pp: number
  attributs: MoveAttributs
  effect ?(move: MoveExecute, state: GameState): void
}

export class Move {
  name: MoveEnum
  type: TypeEnum
  category: MoveCategory
  power: number
  precision: number
  pp: number
  attributs: MoveAttributs
  constructor (options: MoveOptions) {
    const { type, category, power, precision, attributs, name, pp } = options
    this.name = name
    this.type = type
    this.category = category
    this.power = power
    this.precision = precision
    this.attributs = attributs
    this.pp = pp
  }
}


export class MoveExecute extends Move {
  executor: PokemonInBattle
  target?: PokemonInBattle
  stab: 2 | 1.5 = 1.5
  basePower?: number
  multuplier = 1


  private get isStab () {
    return this.executor.pokemon.types.includes(this.type)
  }

  calcBasePower () {
    if (!this.target) throw new Error("can't calc damage agains unexsiting target")
  
    const atkKey = this.category === 'special'  ? 'spAtk' : 'atk'
    const defKey = this.category === 'special'  ? 'spDef' : 'def'
    const atKstat = this.executor.stats[atkKey]
    const defStat = this.target.stats[defKey]
    const level = this.target.level
    const randomFactor =  getRandomInt(85, 100) / 100
  
    return Math.floor((((((2 * level) / 5 + 2) * this.power * atKstat) / defStat) / 50 + 2) * randomFactor)
  }

  constructor (move: Move, option: {
    executor: PokemonInBattle
    target?: PokemonInBattle
  }) {
    super(move)
    this.executor = option.executor
    this.target = option.target
    if (option.target) {
      this.basePower = this.calcBasePower()
    }
    
  }
}