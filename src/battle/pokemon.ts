import { GameState } from "./index.js";
import { Pokemon, StatDict, StatsKey } from "../index.js";
import { StaticStatus, Status, VolatileStatus } from "../effect.js";
import { Move, MoveEnum, MoveExecute } from "../move/index.js";
import { Nature, natureDict, NatureEnum } from "../nature.js";
import { IntRange } from "../type.js";
import { moves } from "../move/index.js";
import { TypeEnum } from "../pokemonType.js";

interface PokemonInBattleOption {
  teamId: 0 | 1
  id: number
  gender?: Gender 
}

interface MoveDict {
  1: Move
  2: Move
  3: Move
  4: Move
}

type Gender =  'male' | 'female' | 'none'

export type InBattleStats = Omit<StatDict, 'hp'> & { eva: number, acc: number }

export type InBattleStatsKeys = keyof InBattleStats

export class PokemonInBattle extends Pokemon {
  teamId: 0 | 1
  private _nature!: NatureEnum
  private _ability: string

  stats: StatDict = {
    hp: this.calculStats('hp'),
    atk: this.calculStats('atk'),
    def: this.calculStats('def'),
    spAtk: this.calculStats('spAtk'),
    spDef: this.calculStats('spDef'),
    spe: this.calculStats('spe')
  }

  recomputeStats (key: StatsKey) {
    return (this.stats[key] = this.calculStats(key))
  }

  get nature (): Nature {
    return natureDict[this._nature]
  }

  constructor (pokemon: Pokemon, options: PokemonInBattleOption,public gameState: GameState, public id: number) {
    super(pokemon)
    this.teamId = options.teamId
    this._ability = pokemon.abilities[0]
    this._gender = options.gender || pokemon.hasGender ? 'male' : 'none'
  }

  
  isready () {
    return (this._nature &&
      (Object.keys(this.moves).length === 4) &&
      (this.totalEv() >= 508))
  }

  effectiveHp: number = this.stats.hp

  statsChange: InBattleStats = {
    atk: 0,
    def: 0,
    spAtk: 0,
    spDef: 0,
    spe: 0,
    eva: 0,
    acc: 0
  }

  isFlying = this.types.includes(TypeEnum.FLYING)

  resetStats () {
    this.statsChange = {
      atk: 0,
      def: 0,
      spAtk: 0,
      spDef: 0,
      spe: 0,
      eva: 0,
      acc: 0
    }
  }

  updateState (key: InBattleStatsKeys, num: number) {
    let value = this.statsChange[key] + num

    if (value < -6 ) {
      value = -6
    }

    if (value > 6) {
      value = 6
    }

    this.statsChange[key] = value
  }

  private calculStats (type: StatsKey) {
    const isHp = type === 'hp'
    const baseStat = this.baseStat[type]
    const ev = this._evs[type]
    const iv = this._ivs[type]
    let value = ((((((baseStat * 2) + iv) + (ev / 4)) * this.level) / 100) + (isHp ? this.level + 10 : 5))

    if (this.nature.decreaseStat === type)  {
      value = value * 0.9
    }

    if (this.nature.increaseStat === type) {
      value = value * 1.1
    }

    return value
  }

  private _evs: StatDict<IntRange<0,253>> = {
    hp: 0,
    atk: 0,
    def: 0,
    spAtk: 0,
    spDef: 0,
    spe: 0
  }

  private _ivs: StatDict<IntRange<0, 32>> = {
    hp: 31,
    atk: 31,
    def: 31,
    spAtk: 31,
    spDef: 31,
    spe: 31
  }

  level: IntRange<1,101> = 1

  get evs () {
    return this._evs
  }

  get ivs () {
    return this._ivs
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

  setIv (key: StatsKey, value: IntRange<0, 32>) {
    
    if (value > 31 || value < 0) {
      throw new Error('incorrect iv value')
    }
    this._ivs[key] = value

    return this
  }

  set nature (nature: NatureEnum) {
    this._nature = nature
  }

  private _moves!: MoveDict

  get moves () {
   return this._moves
  }

  get ability () {
    return this._ability
  }

  private _gender: Gender

  set gender (gender: Gender) {
    if (this.hasGender && gender === 'none') {
      throw new Error("can't set gender to 'none'")
    }

    if (!this.hasGender && gender !== 'none') {
      throw new Error("this pokemon has gender")
    }

    this._gender = gender
  }

  get gender () {
    return this._gender
  }

  staticStatus?: Status<StaticStatus>
  volatileStatus = new Map<VolatileStatus, Status<VolatileStatus>>()

  registerStatus (status: Status<VolatileStatus>) {
    this.gameState.emit('status', this, status)

    if (status.isCancel) {
      return
    }

    this.volatileStatus.set(status.type, status)
    status.initialize(this.gameState)
  }

  unregisterStatus (status: Status<VolatileStatus>) {
    this.volatileStatus.delete(status.type)
    status.clear(this.gameState)
  }

  private totalEv (evs?: StatDict): number {
    return Object.values(evs || this.evs).reduce((a,b) => a + b, 0) 
  }

  
  set ability (name: string) {
    if (!this.abilities.some(ability => ability === name)) {
      throw new Error('invalid ability')
    }

    this._ability = name
  }

  setMove (slot: 1 | 2 | 3 | 4, newMove: MoveEnum) {
    if (!this.movepool.some(move =>  move.name === newMove)) {
      throw new Error('invalid move') 
    }

    this._moves[slot] = moves[newMove]

    return this
  }

  deal (move: MoveExecute) {
    if (move.target !== this) {
      throw new Error('invalid target')
    }
    if (move.basePower) {
      this.effectiveHp -= move.basePower
  
      if (move.attributs.lifeSteal) {
        move.executor.effectiveHp += (move.basePower  * (move.attributs.lifeSteal / 100))
      }

      this.gameState.emit('damageDeal', move)
    }
  }

  isCompatible(pokemon: PokemonInBattle) {
    return this.hasGender && pokemon.hasGender && (this.gender !== pokemon.gender)
  }
}
