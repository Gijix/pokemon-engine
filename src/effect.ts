import { StatsKey } from "./index.js"
import { IntRange } from "./type.js"

export enum Status {
  BURN = 'burn',
  FREEZE = 'freeze',
  PARALYSIS = 'paralysis',
  POISON = 'poison',
  BADLYPOISON = 'badlypoison',
  SLEEP = 'sleep',
}

const { BURN, FREEZE, PARALYSIS, POISON, BADLYPOISON, SLEEP } = Status

export enum VolatileStatus {
  BOUND = ' bound',
  NOESCAPE = 'noescape',
  CONFUSION = 'confusion',
  ABILIT_CHANGE = 'ability change',
  ABILITY_DELETE = 'ability Delete',
  CURSE = 'curse',
  DROWSY = 'drowsy',
  EMBARGO = 'embargo',
  ENCORE = 'encore',
  FLINCH = 'flinch',
  GROUNDED = 'grounded',
  IDENTIFIED = 'identified',
  INFATUATION = 'infatuation',
  NIGHTMARE = 'nightmare',
  PERISHSONG = 'perishsong',
  SEEDED = 'seeded',
  TAUNT = 'taunt',
  TELEKINESIS = 'telekinesis',
  TORMENT = 'torment',
  HEALBLOCK = 'healblock',
  TYPE_CHANGE = 'type change',
  AQUA_RING = 'aqua ring',
  BRACING = 'bracing',
  ATTENTION = 'attention',
  FOCUS = 'focus',
  CURL = 'curl',
  ROOTING = 'rooting',
  LEVITATION = 'levitation',
  MINIMIZE = 'minimize',
  POWER_TRICK = 'power trick',
  MAGIC_COAT = 'magic coat',
  FOCUSED = 'focused',
  RECHARGED = 'recharged',
  INVULNERABLE = 'invulnerable',
  SUBSTITUTE = 'substitute',
  TAKING_AIM = 'taking aim',
  TRANSFORMED = 'transformed',
}

interface StatsChange {
  probability: IntRange<0,101>
  stats: StatsKey
  number: IntRange<0, 6>
}

interface AbstractStatus  {
  type: Status
}
