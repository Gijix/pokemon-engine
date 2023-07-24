import { GameState } from "./battle/index.js";
import { PokemonInBattle } from "./battle/pokemon.js";
import { Pokemon } from "./index.js";
import { ElectricMoveEnum } from "./move/electric.js";
import { Move, MoveExecute } from "./move/index.js";
import { NatureEnum } from "./nature.js";
import { TypeEnum } from "./pokemonType.js";

const gameState = new GameState()
const move = new Move({
  name: ElectricMoveEnum.THUNDERBOLT,
  category: 'special',
  type: TypeEnum.ELECTRIC,
  power: 90,
  precision: 100,
  pp: 24,
  attributs: {
  }
})


const data1 = await Pokemon.create('starmie')
const data2 = await Pokemon.create('heatran')

console.log(data1)
console.log(data2)

const starmie = new PokemonInBattle(data1, {
  level: 100,
  nature: NatureEnum.MODEST,
  teamId: 0
}, gameState)

const heatran = new PokemonInBattle(data2, {
  level: 100,
  nature: NatureEnum.CALM,
  teamId: 1
}, gameState)

const moveExecuted = new MoveExecute(move, {
  executor: starmie,
  target: heatran
})

console.log('starmie',starmie.stats, starmie.pokemon.baseStat)
console.log('heatran' ,heatran.stats, heatran.pokemon.baseStat)
console.log(move)
console.log("starmie => thunderbolt => heatran")
console.log([...Array(1000)].map(() => moveExecuted.calcBasePower()))
