import { TypeEnum } from "../pokemonType.js";
import { TerrainEventEnum, WeatherTerrainEvent } from "./index.js";

export const psychicTerrain = new WeatherTerrainEvent(
  TerrainEventEnum.PSYCHIC_TERRAIN, {
    move (move) {
      if (move.attributs.priority > 0 && move.target && !move.target.isFlying) {
        move.isCancel = true
      }

      if (move.category !== 'status' && !move.executor.isFlying && move.type === TypeEnum.PSYCHIC) {
        move.muli(1.3)
      }
    }
  }
)
export const electricTerrain = new WeatherTerrainEvent(
  TerrainEventEnum.ELECTRIC_TERRAIN, {
    move (move) {
      if (move.category !== 'status'  && !move.executor.isFlying && move.type === TypeEnum.ELECTRIC) {
        move.muli(1.3)
      }
    }
  }
)
export const grassyTerrain = new WeatherTerrainEvent(
  TerrainEventEnum.GRASSY_TERRAIN, {
    move (move) {
      if (!move.executor.isFlying ) {
        if (move.type === TypeEnum.GRASS) {
          move.muli(1.3)
        }
      }
    },
    endTurn (state) {
      state.teams.forEach((team) => {
        team.actualPokemon.effectiveHp += team.actualPokemon.stats.hp / 16
      })
    }
  }
)
export const mistyTerrain = new WeatherTerrainEvent(
  TerrainEventEnum.MISTY_TERRAIN, {}
)