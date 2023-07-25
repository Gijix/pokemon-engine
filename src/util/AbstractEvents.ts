import { GameEvents, GameState } from "../battle/."

export type Listeners<T = any> = Partial<Record<keyof GameEvents, (this: T, ...arg: GameEvents[keyof GameEvents]) => void>> 


export class AbstractEvent<T, S = any> {
  initialize (game: GameState) {
    Object.keys(this.listeners).forEach((key) => {
      const func = this.listeners[key]

      if (func) {
        game.on(key, func)
      }
    })
  }

  clear (game: GameState) {
    Object.keys(this.listeners).forEach((key) => {
      const func = this.listeners[key]

      if (func) {
        game.off(key, func)
      }
    })
  }

  constructor (public type: T , public listeners: Listeners<S>) {}
}