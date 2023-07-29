import { Move } from "./constructor.js";
import { TypeEnum } from "../pokemonType.js";

export enum IceMoveEnum {
  BLIZZARD = "blizzard"
}

const { ICE } = TypeEnum

const { BLIZZARD } = IceMoveEnum

const moveDict: Record<IceMoveEnum, Move> = {
  [BLIZZARD]: new Move({
    name: BLIZZARD,
    category: 'special',
    type: ICE,
    power: 110,
    accuracy: 70,
    pp: 16,
    attributs: {}
  })
}

export default moveDict