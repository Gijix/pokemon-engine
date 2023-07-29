import { BaseEvent, OtherEventEnum } from "../event/index.js";
import { PokemonInBattle } from "./pokemon.js";

export type PokemonTeam = [PokemonInBattle, PokemonInBattle, PokemonInBattle, PokemonInBattle, PokemonInBattle, PokemonInBattle]


export class Team {
  private _spikes = 0
  private _toxicSpikes = 0
  stealthRock = false
  stickyWeb = 0 
  tailwind?: BaseEvent<OtherEventEnum.TAILWIND>

  actualPokemon!: PokemonInBattle

  get spikes () {
    return this._spikes
  }

  get toxicSpikes () {
    return this._toxicSpikes
  }

  set spikes (num: number) {
    if (num > 3) {
      throw new Error('invalid number of spikes')
    }

    this._spikes = num
  }

  set toxicSpikes (num: number) {
    if (num > 2) {
      throw new Error('invalid number of toxicSpikes')
    }

    this._spikes = num
  }

  constructor (public pokemons: PokemonTeam) {}
}