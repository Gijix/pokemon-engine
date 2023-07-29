import { Status } from "../effect.js"
import { WeatherEnum, TerrainEventEnum, OtherEventEnum, BaseEvent, WeatherTerrainEvent } from "../event/index.js"
import { MoveExecute } from "../move/index.js"
import { EventEmitter } from "../util/emitter.js"
import { PokemonInBattle } from "./pokemon.js"
import { PokemonTeam, Team } from "./team.js"

export type GameEvents = {
  damageDeal: [move: MoveExecute],
  move: [move: MoveExecute],
  startTurn: [state: GameState],
  endTurn: [state: GameState],
  kill: [move: MoveExecute],
  death: [death: { pokemon: PokemonInBattle, executor?: PokemonInBattle }]
  summon: [pokemon: PokemonInBattle],
  switch: [oldPokemon: PokemonInBattle, newPokemon: PokemonInBattle],
  message: [content: string],
  init: [pokemon: PokemonInBattle]
  status: [pokemon: PokemonInBattle, status: Status]
}

export class GameState extends EventEmitter<GameEvents> {
  teams: [Team, Team]
  constructor (team0: PokemonTeam, team1: PokemonTeam ) {
    super()
    this.teams = [new Team(team0), new Team(team1)]
  }

  setActualPokemon (id: 0 | 1, pokemon: PokemonInBattle) {
    if (!this.teams[id].pokemons.includes(pokemon)) {
      throw new Error("pokemon deosn't belong to the team")
    }

    this.teams[id].actualPokemon = pokemon
  }

  initiliaze () {
    this.on('endTurn', () => {
      this.volatileTerrain.forEach((terrain) => {
        if (terrain.turn <= 0) {
          this.unregisterTerrain(terrain)
        } else {
          terrain.turn--
        }
      });

      [this.terrain, this.weather].forEach(event => {
        if (event) {
          if (event.turn > 1) {
            event.turn--
          } else {
            event.clear(this)
            event = undefined
          }
        }
      })
    })

    this.on('switch', (oldPokemon) => {
      oldPokemon.volatileStatus.forEach(status => {
        status.clear(this)
      })

      oldPokemon.volatileStatus.clear()
      oldPokemon.resetStats()
    })
  }

  registerTerrain (terrain: BaseEvent<OtherEventEnum>) {
    this.volatileTerrain.set(terrain.type, terrain)
    terrain.initialize(this)
  }

  unregisterTerrain (terrain: BaseEvent<OtherEventEnum>) {
    this.volatileTerrain.delete(terrain.type)
    terrain.clear(this)
  }

  weather: WeatherTerrainEvent<WeatherEnum> | undefined = undefined
  terrain: WeatherTerrainEvent<TerrainEventEnum> | undefined = undefined
  volatileTerrain: Map<OtherEventEnum, BaseEvent<OtherEventEnum>> = new Map
}
