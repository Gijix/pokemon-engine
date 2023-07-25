import { GameEvents } from "../battle/index.js"
import { AbstractEvent } from "../util/AbstractEvents.js"

export enum WeatherEnum {
  SANDSTORM = "sandstorm",
  SNOW = 'snow',
  RAIN = 'rain',
  HARSH_SUNLIGHT = 'harsh sunlight',
  HAIL = 'hail'
}

export enum TerrainEventEnum {
  ELECTRIC_TERRAIN = 'electric terrain',
  MISTY_TERRAIN = 'misty terrain',
  GRASSY_TERRAIN = 'grassy terrain',
  PSYCHIC_TERRAIN = 'psychic terrain'
}

export enum OtherEventEnum {
  TAILWIND = 'tailwind',
  DISTORSION = 'distortion',
  GRAVITY = 'gravity',
  MAGIC_ROMM = 'magic room',
  MIST = 'mist',
  SAFEGUARD = 'safeguard',
  WONDER_ROMM = 'wonder room'
}

export type EventEnum = WeatherEnum | TerrainEventEnum | OtherEventEnum

export type Listeners = Partial<Record<keyof GameEvents, (...arg: GameEvents[keyof GameEvents]) => void>> 
interface EventOption<T extends EventEnum> {
  type: T
  turn: number
  extended?: number
}

export class BaseEvent<T extends EventEnum = EventEnum> extends AbstractEvent<T> {
  turn: number
  extended?: number

  extend () {
    if (this.extended) {
      this.turn = this.extended
    }
  }

  constructor (options: EventOption<T>,public listeners: Listeners) {
    super(options.type, listeners)
    this.extended = options.extended
    this.type = options.type
    this.turn = options.turn
  }
}


export class WeatherTerrainEvent<T extends TerrainEventEnum | WeatherEnum> extends BaseEvent<T> {
  constructor(type: T, listeners: Listeners) {
    super({
      turn: 5,
      extended: 8,
      type
    }, listeners)
  }
}
