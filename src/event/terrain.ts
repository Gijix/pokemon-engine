import { TerrainEventEnum, WeatherTerrainEvent } from "./index.js";

export const psychicTerrain = new WeatherTerrainEvent(
  TerrainEventEnum.PSYCHIC_TERRAIN, {}
)
export const electricTerrain = new WeatherTerrainEvent(
  TerrainEventEnum.ELECTRIC_TERRAIN, {}
)
export const grassyTerrain = new WeatherTerrainEvent(
  TerrainEventEnum.GRASSY_TERRAIN, {}
)
export const mistyTerrain = new WeatherTerrainEvent(
  TerrainEventEnum.MISTY_TERRAIN, {}
)