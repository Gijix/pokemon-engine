import { WeatherEnum, TerrainEventEnum, OtherEventEnum, BaseEvent, WeatherTerrainEvent } from "../event/index.js"
import { MoveExecute } from "../move/index.js"
import { EventEmitter } from "../util/emitter.js"
import { PokemonInBattle, PokemonTeam } from "./pokemon.js"

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
}

interface StaticTerrain {
  spikes: number,
  toxicSpikes: number,
  stealthRock: boolean,
  stickyWeb: boolean,
  tailwind?: BaseEvent<OtherEventEnum.TAILWIND>
}

const baseTerrain: StaticTerrain = {
  spikes: 0,
  toxicSpikes: 0,
  stealthRock: false,
  stickyWeb: false,
}

interface Team {
  staticTerrain: StaticTerrain,
  pokemons: PokemonTeam,
}

export class GameState extends EventEmitter<GameEvents> {
  teams: [Team, Team] 
  constructor (team0: PokemonTeam, team1: PokemonTeam ) {
    super()
    this.teams = [
      {
        staticTerrain: baseTerrain,
        pokemons: team0,
      },
      {
        staticTerrain: baseTerrain,
        pokemons: team1
      }
    ]
  }

  initiliaze () {
    this.on('endTurn', () => {
      this.volatileTerrain.forEach((terrain) => {
        if (terrain.turn <= 0) {
          this.unregisterTerrain(terrain)
        } else {
          terrain.turn--
        }
      })
    })

    if (this.weather) {
      if (this.weather.turn > 1) {
        this.weather.turn--
      } else {
        this.weather.clear(this)
        this.weather = undefined
      }
    }
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
