import { InBattleStats, PokemonInBattle } from "./battle/pokemon.js"
import { StatsKey } from "./index.js"
import { IntRange } from "./type.js"
import { AbstractEvent, Listeners } from "./util/AbstractEvents.js"
import { getRandomInt } from "./util/math.js"

export interface SecondaryEffect  {
  type: IStatus,
  rate: number,
  self?: boolean
}

export interface StatChange {
  stat: InBattleStats,
  rate: number
  self?: boolean
}

export enum StaticStatus {
  BURN = 'burn',
  FREEZE = 'freeze',
  PARALYSIS = 'paralysis',
  POISON = 'poison',
  BADLYPOISON = 'badlypoison',
  SLEEP = 'sleep',
}

const { BURN, FREEZE, PARALYSIS, POISON, BADLYPOISON, SLEEP } = StaticStatus

export enum VolatileStatus {
  BOUND = ' bound',
  NOESCAPE = 'noescape',
  CONFUSION = 'confusion',
  ABILIT_CHANGE = 'ability change',
  ABILITY_DELETE = 'ability Delete',
  CURSE = 'curse',
  DROWSY = 'drowsy',
  EMBARGO = 'embargo',
  ENCORE = 'encore',
  FLINCH = 'flinch',
  GROUNDED = 'grounded',
  IDENTIFIED = 'identified',
  INFATUATION = 'infatuation',
  NIGHTMARE = 'nightmare',
  PERISHSONG = 'perishsong',
  SEEDED = 'seeded',
  TAUNT = 'taunt',
  TELEKINESIS = 'telekinesis',
  TORMENT = 'torment',
  HEALBLOCK = 'healblock',
  TYPE_CHANGE = 'type change',
  AQUA_RING = 'aqua ring',
  BRACING = 'bracing',
  ATTENTION = 'attention',
  FOCUS = 'focus',
  CURL = 'curl',
  ROOTING = 'rooting',
  LEVITATION = 'levitation',
  MINIMIZE = 'minimize',
  POWER_TRICK = 'power trick',
  MAGIC_COAT = 'magic coat',
  FOCUSED = 'focused',
  RECHARGED = 'recharged',
  INVULNERABLE = 'invulnerable',
  SUBSTITUTE = 'substitute',
  TAKING_AIM = 'taking aim',
  TRANSFORMED = 'transformed',
}

export type IStatus = VolatileStatus | StaticStatus

export interface StatsChange {
  probability: IntRange<0,101>
  stats: StatsKey
  number: IntRange<0, 6>
}

export abstract class Status<T extends IStatus = IStatus> extends AbstractEvent<T, Status> {
  abstract pokemon: PokemonInBattle
  protected constructor (name: T, listener: Listeners<Status>) {
    Object.keys(listener).forEach((key) => {
      let fn = listener[key]
      if (fn) {
        //@ts-ignore
        listener[key] = fn.bind(this)
      }
    })
    super(name, listener)
  }
  turn = 0;
  isTurnLock = false

  is (type: IStatus): this is Status<typeof type> {
    return this.type === type
  }

  static create<T extends IStatus> (name: T,listener: Listeners<Status & { pokemon: PokemonInBattle}>, ) {
    return class extends this<T> {
      constructor (public pokemon: PokemonInBattle, isTurnLock?: boolean) {
        super(name, listener)
        if (isTurnLock) {
          this.isTurnLock = true
        }
      }
    }
  }
}

export const StatusDict: Record<IStatus, ReturnType<(typeof Status)['create']>> = {
  [SLEEP]: Status.create(StaticStatus.SLEEP, {
    move (move) {
      if (move.executor !== this.pokemon) return
      if (this.isTurnLock) {
        if (this.turn >= 2) {
          this.pokemon.staticStatus = undefined
          this.clear(this.pokemon.gameState)
        } else {
          this.turn++
          return
        }
      }
      if (this.turn === 0) {
        this.turn++
      } else {
        if(getRandomInt(0, 4 - this.turn) === 0) {
          this.pokemon.staticStatus = undefined
          this.clear(this.pokemon.gameState)
        } else {
          this.turn++
        }
      }
    }
  }),
  [VolatileStatus.INFATUATION]: Status.create(VolatileStatus.INFATUATION,{
    move (move) {
      if (move.executor !== this.pokemon) return
      if (getRandomInt(0,1) === 0) {
        move.isCancel = true
      }
    }
  })
}
