import { TypeEnum } from "../pokemonType.js";
import { GameState } from "../battle/index.js";
import { PokemonInBattle } from "../battle/pokemon.js";
import { NormalMoveEnum } from "./normal.js";
import { WaterMoveEnum } from "./water.js";
import { ElectricMoveEnum } from "./electric.js";
import { getRandomInt } from "../util/math.js";
import { StatsChange } from "../effect.js";

type MoveCategory = 'special' | 'status' | 'physical'

type MoveEnum = NormalMoveEnum  | WaterMoveEnum | ElectricMoveEnum

interface MoveAttributs {
  isContact?: boolean
  isMissable?: boolean
  lifeSteal?: number
  selfTarget?: boolean
  statsChange?: StatsChange[]
}

interface MoveOptions {
  name: MoveEnum
  type: TypeEnum
  category: MoveCategory
  power?: number
  precision?: number
  pp: number
  attributs: MoveAttributs
  effect?(this: GameState, move: MoveExecute): void
}

export class Move {
  name: MoveEnum
  type: TypeEnum
  category: MoveCategory
  power: number
  precision: number
  pp: number
  attributs: MoveAttributs
  effect?: (this: GameState, move: MoveExecute) => void 
  constructor (options: MoveOptions) {
    const { type, category, power, precision, attributs, name, effect, pp } = options
    this.name = name
    this.type = type
    this.category = category
    this.power = power || 0
    this.precision = precision || 0
    this.attributs = attributs
    this.pp = pp
    this.effect = effect
  }
}

export class MoveExecute extends Move {
  executor: PokemonInBattle
  target?: PokemonInBattle
  stab: 2 | 1.5 = 1.5
  basePower?: number
  multiplier = 1
  isCancel = false

  private get isStab () {
    return this.executor.types.includes(this.type)
  }

  dispatch (state: GameState) {
    state.emit('move', this)

    if (this.isCancel) {
      return
    }

    if (this.target) {
      if (this.category !== 'status') {
        this.basePower = this.calcBasePower() * this.multiplier * this.stab
        this.target.deal(this)
      }

      if (this.effect) {
        this.effect.bind(state)(this)
      }
    }
  }

  calcBasePower () {
    if (!this.target) throw new Error("can't calc damage agains unexisting target")
  
    const atkKey = this.category === 'special'  ? 'spAtk' : 'atk'
    const defKey = this.category === 'special'  ? 'spDef' : 'def'
    const atKstat = this.executor.stats[atkKey]
    const defStat = this.target.stats[defKey]
    const level = this.target.level
    const randomFactor =  getRandomInt(85, 100) / 100
  
    let value =  Math.floor((((((2 * level) / 5 + 2) * this.power * atKstat) / defStat) / 50 + 2) * randomFactor)
    let atkModifier = this.executor.statsChange[atkKey]
    let defModifier = this.target.statsChange[defKey]

    const dec = (modifier: number) => value = value / (1 + (modifier * -1 * 0.5))
    const inc = (modifier: number) => value = value * (1 + (modifier * 0.5))
    if (atkModifier < 0) {
      dec(atkModifier)
    }

    if (atkModifier > 0) {
      inc(atkModifier)
    }

    if (defModifier < 0) {
      inc(defModifier)
    }

    if (defModifier > 0) {
      dec(defModifier)
    }
    
    return Math.round(value)
  }

  muli(num: number) {
    return (this.multiplier = this.multiplier * num)
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