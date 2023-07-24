export enum TypeEnum {
  FIRE = 'fire',
  WATER = 'water',
  GRASS = 'grass',
  ICE = 'ice',
  ELECTRIC = 'electric',
  FLYING = 'flying',
  GROUND = 'ground',
  ROCK = 'rock',
  STEEL = 'steel',
  FIGHTING = 'fighting',
  PSYCHIC = 'psychic',
  GHOST = 'ghost',
  DARK = 'dark',
  BUG = 'bug',
  POISON = 'poison',
  FAIRY = 'fairy',
  DRAGON = 'dragon',
  NORMAL = 'normal'
}

const { FIRE, WATER, GRASS, ICE, ELECTRIC, FLYING, FAIRY, FIGHTING, POISON, DRAGON, DARK, GHOST, GROUND, ROCK, STEEL, NORMAL, PSYCHIC, BUG } = TypeEnum


interface IType<S extends TypeEnum> {
  name: S
  effectiveness: TypeEnum[]
  resistances: TypeEnum[]
  weakness: TypeEnum[]
  innefficiencies: TypeEnum[]
  immunities?: TypeEnum[]
  ineffectiveness?: TypeEnum[]
}

class Type<S extends TypeEnum = TypeEnum> implements IType<S> {
  name: S
  effectiveness: TypeEnum[]
  resistances: TypeEnum[]
  weakness: TypeEnum[]
  innefficiencies: TypeEnum[]
  immunities: TypeEnum[] = []
  ineffectiveness: TypeEnum[] = []


  isWeakAgainst (type: TypeEnum) {
    return this.weakness.includes(type)
  }

  isEffectiveAgainst (type: TypeEnum) {
    return this.effectiveness.includes(type)
  }

  isStrongAgainst (type: TypeEnum) {
    return this.resistances.includes(type)
  }

  isInnefficentAgainst (type: TypeEnum) {
    return this.ineffectiveness.includes(type)
  }

  isImmuneTo (type: TypeEnum) {
    return this.immunities.includes(type)
  }

  isInneffectiveAgainst (type: TypeEnum) {
    return this.ineffectiveness.includes(type)
  }

  constructor (options:IType<S>) {
    const { name, effectiveness, weakness, resistances, innefficiencies } = options
    this.name = name
    this.effectiveness = effectiveness
    this.weakness = weakness
    this.resistances = resistances
    this.innefficiencies = innefficiencies

    if (options.immunities) this.immunities = options.immunities
    if (options.ineffectiveness) this.ineffectiveness = options.ineffectiveness
  }
}

export const typeDict = {
  [GRASS] : new Type({
    name: GRASS,
    effectiveness: [WATER, GROUND, ROCK],
    weakness: [FIRE, BUG, POISON, FLYING, ICE],
    resistances: [GROUND, WATER, GRASS, ELECTRIC],
    innefficiencies: [BUG, FIRE, DRAGON, POISON, STEEL, FLYING, GRASS]
  }),
  [FIRE] : new Type({
    name: FIRE,
    effectiveness: [STEEL, GRASS, BUG, ICE],
    weakness: [WATER, GROUND, ROCK],
    resistances: [STEEL, FIRE, BUG, GRASS, FAIRY, ICE],
    innefficiencies: [WATER, FIRE, ROCK, DRAGON]
  }),
  [WATER] : new Type({
    name: WATER,
    effectiveness: [GROUND, ROCK, FIRE],
    weakness: [GRASS, ELECTRIC],
    resistances: [WATER, FIRE, ICE, STEEL],
    innefficiencies: [GRASS, WATER, DRAGON]
  }),
  [ICE] : new Type({
    name: ICE,
    effectiveness: [GROUND, GRASS, FLYING, DRAGON],
    weakness: [STEEL, ROCK, FIRE, FIGHTING],
    resistances: [ICE],
    innefficiencies: [STEEL, WATER, ICE, FIRE]
  }),
  [ELECTRIC] : new Type({
    name: ELECTRIC,
    effectiveness: [FLYING, WATER],
    weakness: [GROUND],
    resistances: [ELECTRIC, FLYING, STEEL],
    innefficiencies: [GRASS, DRAGON, ELECTRIC],
    ineffectiveness: [GROUND]
  }),
  [GROUND] : new Type({
    name: GROUND,
    effectiveness: [ELECTRIC, ROCK, STEEL, FIRE],
    weakness: [ICE, WATER, GRASS],
    resistances: [ROCK, POISON],
    innefficiencies: [GRASS, BUG],
    ineffectiveness: [FLYING],
    immunities: [ELECTRIC],
  }),
  [FLYING] : new Type({
    name: FLYING,
    effectiveness: [FIGHTING, BUG, GRASS],
    weakness: [ELECTRIC, ROCK, ICE],
    resistances: [FIGHTING, GRASS, BUG],
    innefficiencies: [ROCK, STEEL, ELECTRIC],
    immunities: [GROUND]
  }),
  [ROCK] : new Type({
    name: ROCK,
    effectiveness: [FLYING, FIRE, BUG, ICE],
    weakness: [GROUND, WATER, FIGHTING, GRASS, STEEL],
    resistances: [FIRE, POISON, NORMAL, FLYING],
    innefficiencies: [STEEL, FIGHTING, GROUND]
  }),
  [STEEL] : new Type({
    name: STEEL,
    effectiveness: [ICE, FAIRY, ROCK],
    weakness: [GROUND, FIRE, FIGHTING],
    resistances: [STEEL, ICE, GRASS, DRAGON, BUG, FAIRY, FLYING, NORMAL, PSYCHIC, ROCK],
    innefficiencies: [ELECTRIC, WATER, FIRE, STEEL],
    immunities: [POISON]
  }),
  [FIGHTING] : new Type({
    name: FIGHTING,
    effectiveness: [GRASS, FAIRY],
    weakness: [GROUND, PSYCHIC],
    resistances: [POISON, GRASS, BUG, FIGHTING, FAIRY],
    innefficiencies: [POISON, GROUND, GHOST, ROCK],
    ineffectiveness: [STEEL]
  }),
  [PSYCHIC] : new Type({
    name: PSYCHIC,
    effectiveness: [POISON, FIGHTING],
    weakness: [DARK, BUG, GHOST],
    resistances: [PSYCHIC, FIGHTING],
    innefficiencies: [PSYCHIC, STEEL],
    ineffectiveness: [DARK]
  }),
  [DARK] : new Type({
    name: DARK,
    effectiveness: [GHOST, PSYCHIC],
    weakness: [BUG, FIGHTING, FAIRY],
    resistances: [DARK, GHOST],
    innefficiencies: [FAIRY, DARK, FIGHTING],
    immunities: [PSYCHIC]
  }),
  [GHOST] : new Type({
    name: GHOST,
    effectiveness: [GHOST, PSYCHIC],
    weakness: [GHOST, DARK],
    resistances: [BUG, POISON],
    innefficiencies: [DARK],
    immunities: [NORMAL, FIGHTING],
    ineffectiveness: [NORMAL]
  }),
  [BUG] : new Type({
    name: BUG,
    effectiveness: [GRASS, PSYCHIC, DARK],
    weakness: [FIRE, ROCK, FLYING],
    resistances: [FIGHTING, GRASS, GROUND],
    innefficiencies: [STEEL, FLYING, FIGHTING, POISON, GHOST, FIRE, FAIRY]
  }),
  [FAIRY] : new Type({
    name: FAIRY,
    effectiveness: [FIGHTING, DARK, DRAGON],
    weakness: [POISON, STEEL],
    resistances: [DARK, FIGHTING, BUG],
    innefficiencies: [STEEL, POISON, FIRE],
    immunities: [DRAGON]
  }),
  [DRAGON] : new Type({
    name: DRAGON,
    effectiveness: [DRAGON],
    weakness: [DRAGON, ICE, FAIRY],
    resistances: [GRASS, ELECTRIC, FIRE, WATER],
    innefficiencies: [STEEL],
    ineffectiveness: [FAIRY]
  }),
  [NORMAL] : new Type({
    name: NORMAL,
    effectiveness: [],
    weakness: [FIGHTING],
    resistances: [],
    innefficiencies: [ROCK, STEEL],
    ineffectiveness: [GHOST]
  }),
}
