import { Move } from "./constructor.js"
import { TypeEnum } from "../pokemonType.js"

export enum GroundMoveEnum {
  BULDOZE = 'buldoze',
  EARTHQUAKE = 'earthquake',
  MAGNITUDE = 'magnitude'
}

const { BULDOZE, EARTHQUAKE, MAGNITUDE } = GroundMoveEnum
const { GROUND } = TypeEnum

const moveDict: Record<GroundMoveEnum, Move> = {
  /**
   * WIP
   */
  [BULDOZE]: new Move({
    name: BULDOZE,
    accuracy: 100,
    power: 60,
    category: 'physical',
    type: GROUND,
    pp: 24
  }),
  /**
   * WIP
   */
  [EARTHQUAKE]: new Move({
    name: EARTHQUAKE,
    accuracy: 100,
    power: 100,
    pp: 16,
    category: 'physical',
    type: GROUND,
  }),
  /**
   * WIP
   */
  [MAGNITUDE]: new Move({
    name: MAGNITUDE,
    accuracy: 100,
    pp: 16,
    category: 'physical',
    type: GROUND,
    init () {
      
    }
  })
}

export default moveDict