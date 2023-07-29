import { typeDict } from "../pokemonType.js";
import { GameState } from "../battle/index.js";
import { PokemonInBattle } from "../battle/pokemon.js";
import { NormalMoveEnum } from "./normal.js";
import { WaterMoveEnum } from "./water.js";
import { ElectricMoveEnum } from "./electric.js";
import { getRandomInt } from "../util/math.js";
import { FlyingMoveEnum } from "./flying.js";
import { IceMoveEnum } from "./ice.js";
import { GroundMoveEnum } from "./ground.js";
import { Move } from './constructor.js'

export class MoveExecute extends Move {
  executor: PokemonInBattle
  target?: PokemonInBattle
  stab: 2 | 1.5 = 1.5
  basePower?: number
  multiplier = 1
  isCancel = false
  isBlockedBySleeping = true

  private get isStab () {
    return this.executor.types.includes(this.type)
  }

  dispatch (state: GameState) {
    if (this.init) {
      this.init.bind(state)(this)
    }

    state.emit('move', this)

    if (this.isCancel) {
      return
    }

    if (this.target) {
      if (this.category !== 'status') {
        this.basePower = this.calcBasePower() * this.multiplier 
        if (this.isStab) {
          this.basePower = this.muli(this.stab)
        }

        this.target.types.forEach(move => {
          const moveType = typeDict[this.type]
          if (moveType.isInnefficentAgainst(move)) {
            this.muli(0)
            return
          }

          if (moveType.isEffectiveAgainst(move)) {
            this.muli(2)
            return
          }

          if(moveType.isInneffectiveAgainst(move)) {
            this.muli(0.5)
            return
          }
        })

        this.target.deal(this)
      }
    }

    if (this.effect) {
      this.effect.bind(state)(this)
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

import normalMoves from "./normal.js";
import waterMoves from "./water.js";
import electricMoves from "./electric.js";
import flyingMoves from "./flying.js";

export type MoveEnum = NormalMoveEnum  | WaterMoveEnum | ElectricMoveEnum | FlyingMoveEnum | WaterMoveEnum | IceMoveEnum | GroundMoveEnum
export const moves: Record<MoveEnum, Move> = {...normalMoves, ...waterMoves, ...electricMoves, ...flyingMoves}