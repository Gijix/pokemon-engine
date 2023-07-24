import { GameState } from ".";
import { Pokemon, StatDict, StatsKey } from "..";
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

export class PokemonInBattle {
  teamId: 0 | 1
  stats: StatDict
  private _nature: NatureEnum
  private _ability: string

  get nature () {
    return natureDict[this._nature]
  }

  constructor (public pokemon: Pokemon, option: PokemonInBattleOption, public gameState: GameState) {
    this.teamId = option.teamId
    this.level = option.level
    this._nature = option.nature
    this._ability = pokemon.abilities[0]
    const fn = this.calculStats.bind(this)
    this.stats = {
      get atk (){ return fn('atk')},
      get def (){ return fn('def')},
      get spAtk (){ return fn('spAtk')},
      get spDef (){ return fn('spDef')},
      get spe (){ return fn('spe')},
      get hp (){ return fn('hp')}
    }
  }

  private calculStats (type: StatsKey) {
    const isHp = type === 'hp'
    const baseStat = this.pokemon.baseStat[type]
    const ev = this._evs[type]
    const iv = this._ivs[type]
    let value = ((((((baseStat * 2) + iv) + (ev / 4)) * this.level) / 100) + (isHp ? this.level + 10 : 5))

    if (this.nature.decreaseStat === type)  {
      value = value * 0.9
    }

    if (this.nature.increaseStat === type) {
      value = value * 1.1
    }

    return Math.floor(value) 
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

  private totalEv (evs?: StatDict): number {
    return Object.values(evs || this.evs).reduce((a,b) => a + b, 0) 
  }

  
  set ability (name: string) {
    if (!this.pokemon.abilities.some(ability => ability === name)) {
      throw new Error('invalid ability')
    }

    this._ability = name
  }

  setMove (slot: 1 | 2 | 3 | 4, move: string) {
    if (!this.pokemon.movepool.some(name =>  name === move)) {
      throw new Error('invalid move') 
    }

    this.moves[slot] = move

    return this
  }

  useMove (slot:1 | 2 | 3 | 4, target: PokemonInBattle) {
    
  }
}

export type PokemonTeam = [PokemonInBattle, PokemonInBattle, PokemonInBattle, PokemonInBattle, PokemonInBattle, PokemonInBattle]