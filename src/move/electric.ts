import { Move } from ".";
import { TypeEnum } from "../pokemonType";

export enum ElectricMoveEnum {
  THUNDERBOLT = 'thunderbolt',
  THUNDER = 'thunder',
}

export const moveDict: Record<ElectricMoveEnum, Move> = {
  [ElectricMoveEnum.THUNDERBOLT]: new Move({
    name: ElectricMoveEnum.THUNDERBOLT,
    category: 'special',
    type: TypeEnum.ELECTRIC,
    power: 90,
    precision: 100,
    pp: 24,
    attributs: {
    }
  })
}