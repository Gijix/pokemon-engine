import { Move } from "./constructor.js";
import { TypeEnum } from "../pokemonType.js";

export enum ElectricMoveEnum {
  THUNDERBOLT = 'thunderbolt',
  THUNDER = 'thunder',
}

const { ELECTRIC } = TypeEnum

const { THUNDERBOLT, THUNDER } = ElectricMoveEnum

const moveDict = {
  [THUNDERBOLT]: new Move({
    name: THUNDERBOLT,
    category: 'special',
    type: ELECTRIC,
    power: 90,
    accuracy: 100,
    pp: 24,
    attributs: {
    }
  })
} satisfies Record<ElectricMoveEnum, Move>

export default moveDict