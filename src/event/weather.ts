import { WeatherEnum, WeatherTerrainEvent } from "./index.js";

export const sunlight = new WeatherTerrainEvent(
  WeatherEnum.HARSH_SUNLIGHT, {}
)
export const rain = new WeatherTerrainEvent(
  WeatherEnum.RAIN, {}
)
export const hail = new WeatherTerrainEvent(
  WeatherEnum.HAIL, {}
)
export const snow = new WeatherTerrainEvent(
  WeatherEnum.SNOW, {}
)
export const sandstorm = new WeatherTerrainEvent(
  WeatherEnum.SANDSTORM, {}
)
