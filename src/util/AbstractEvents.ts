import { GameEvents, GameState } from "../battle/index.js"

export type Listeners<T = any, S extends keyof GameEvents = keyof GameEvents> = Partial<{
  [K in S]: (this: T, ...args: GameEvents[K]) => unknown;
}>;

export abstract class AbstractEvent<T, S = any, R extends keyof GameEvents = keyof GameEvents> {
  gameState!: GameState
  isCancel = false;
  initialize (state: GameState) {
    this.gameState = state
    Object.keys(this.listeners).forEach((key) => {
      const func = this.listeners[key]

      if (func) {
        state.on(key, func)
      }
    })
  }

  clear (state: GameState) {
    Object.keys(this.listeners).forEach((key) => {
      const func = this.listeners[key]

      if (func) {
        state.off(key, func)
      }
    })
  }

  constructor (public type: T , public listeners: Listeners<S, R>) {}
}