import { ElectricMoveEnum } from '../move/electric.js';
import { FlyingMoveEnum } from '../move/flying.js';
import { IceMoveEnum } from '../move/ice.js';
import { MoveEnum } from '../move/index.js';
import { TypeEnum } from "../pokemonType.js";
import { WeatherEnum, WeatherTerrainEvent } from "./index.js";

export const sunlight = new WeatherTerrainEvent(
  WeatherEnum.HARSH_SUNLIGHT, {
    move (move) {
      if (move.type === TypeEnum.FIRE) {
        move.muli(1.5)
      }
      if (move.type === TypeEnum.WATER) {
        move.muli(0.5)
      }

      if (([ElectricMoveEnum.THUNDER, FlyingMoveEnum.HURRICANE] as MoveEnum[]).includes(move.name)) {
        move.accuracy = 50
      }
    }
  }
)
export const rain = new WeatherTerrainEvent(
  WeatherEnum.RAIN, {
    move (move) {
      if (move.type === TypeEnum.WATER) {
        move.muli(1.5)
      }
      if (move.type === TypeEnum.FIRE) {
        move.muli(0.5)
      }

      if (([ElectricMoveEnum.THUNDER, FlyingMoveEnum.HURRICANE] as MoveEnum[]).includes(move.name)) {
        move.attributs.isMissable = false
      }
    }
  }
)
export const hail = new WeatherTerrainEvent(
  WeatherEnum.HAIL, {
    endTurn (state) {
      state.teams.forEach(team => {
        const poke = team.actualPokemon
        if (poke.types.includes(TypeEnum.ICE)) return
        poke.effectiveHp -= (poke.stats.hp / 16)
      })
    },
    move (move) {
      if (move.name === IceMoveEnum.BLIZZARD) {
        move.attributs.isMissable = false
      }
    }
  },
)
export const snow = new WeatherTerrainEvent(
  WeatherEnum.SNOW, {
    move (move) {
      if (!(move.target && move.target.types.includes(TypeEnum.ICE))) return
      if (move.category === 'physical') {
        move.muli(2/3)
      }
    }
  }
)
export const sandstorm = new WeatherTerrainEvent(
  WeatherEnum.SANDSTORM, {
    endTurn (state) {
      state.teams.forEach(team => {
        const poke = team.actualPokemon
        if (poke.types.some((type) => [TypeEnum.ROCK, TypeEnum.GROUND, TypeEnum, TypeEnum.STEEL].includes(type))) return
        poke.effectiveHp -= (poke.stats.hp / 16)
      })
    },
    move (move) {
      if (move.category === 'special' && move.target && move.target.types.includes(TypeEnum.ROCK)) {
        move.muli(2/3)
      }
    }
  }
)
