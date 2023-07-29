import { Move } from "./constructor.js";
import { TypeEnum } from "../pokemonType.js";

export enum FlyingMoveEnum {
  HURRICANE = 'hurricane'
}

const { FLYING } = TypeEnum

const { HURRICANE } = FlyingMoveEnum

const moveDict = {
  [HURRICANE]: new Move({
    name: HURRICANE,
    category: 'special',
    type: FLYING,
    power: 110,
    accuracy: 70,
    pp: 16,
    attributs: {}
  })
} satisfies Record<FlyingMoveEnum, Move>

export default moveDict