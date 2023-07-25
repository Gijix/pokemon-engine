import { GameState } from ".";
import { Pokemon, StatDict, StatsKey } from "..";
import { StaticStatus, Status } from "../effect";
import { MoveExecute } from "../move/.";
import { natureDict, NatureEnum } from "../nature.js";
import { IntRange } from "../type.js";

interface PokemonInBattleOption {
  teamId: 0 | 1
  level: IntRange<1, 101>
  nature: NatureEnum
}

interface MoveDict {
  1: string
  2: string
  3: string
  4: string
}

type Gender =  'male' | 'female'

export type InBattleStats = Omit<StatDict, 'hp'> & { eva: number, acc: number }

export type InBattleStatsKeys = keyof InBattleStats

export class PokemonInBattle extends Pokemon {
  teamId: 0 | 1
  private _nature: NatureEnum
  private _ability: string

  stats: StatDict = {
    hp: this.calculStats('hp'),
    atk: this.calculStats('atk'),
    def: this.calculStats('def'),
    spAtk: this.calculStats('spAtk'),
    spDef: this.calculStats('spDef'),
    spe: this.calculStats('spe')
  }

  get nature () {
    return natureDict[this._nature]
  }

  constructor (pokemon: Pokemon, option: PokemonInBattleOption, public gameState: GameState) {
    super(pokemon)
    this.teamId = option.teamId
    this.level = option.level
    this._nature = option.nature
    this._ability = pokemon.abilities[0]  
  }

  statsChange: InBattleStats = {
    atk: 0,
    def: 0,
    spAtk: 0,
    spDef: 0,
    spe: 0,
    eva: 0,
    acc: 0
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

  private moves: Partial<MoveDict> = {}
  get ability () {
    return this._ability
  }

  gender: Gender =  'male'
  staticStatus?: Status

  private totalEv (evs?: StatDict): number {
    return Object.values(evs || this.evs).reduce((a,b) => a + b, 0) 
  }

  
  set ability (name: string) {
    if (!this.abilities.some(ability => ability === name)) {
      throw new Error('invalid ability')
    }

    this._ability = name
  }

  setMove (slot: 1 | 2 | 3 | 4, move: string) {
    if (!this.movepool.some(name =>  name === move)) {
      throw new Error('invalid move') 
    }

    this.moves[slot] = move

    return this
  }

  deal (move: MoveExecute) {
    if (move.basePower) {
      this.stats.hp = this.stats.hp - move.basePower
      this.gameState.emit('damageDeal', move)
  
      if (this.stats.hp <= 0) {
        this.gameState.emit('kill', move)
      } else {
      }
    }
  } 
}

export type PokemonTeam = [PokemonInBattle, PokemonInBattle, PokemonInBattle, PokemonInBattle, PokemonInBattle, PokemonInBattle]