import { Move, MoveEnum } from "./index.js";

export enum WaterMoveEnum {
  SCALD = 'scald'
}

const { SCALD } = WaterMoveEnum

const moveDict = {
  [SCALD]: {
    name: SCALD,

  }
} satisfies Record<WaterMoveEnum, Move>

export default moveDict