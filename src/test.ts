import { GameState } from "./battle/index.js";
import { PokemonInBattle } from "./battle/pokemon.js";
import { Pokemon } from "./index.js";
import { moveDict } from "./move/electric.js";
import { MoveExecute } from "./move/index.js";
import { NatureEnum } from "./nature.js";

const gameState = new GameState()

const data1 = await Pokemon.create('starmie')
const data2 = await Pokemon.create('heatran')

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

const moveExecuted = new MoveExecute(moveDict.thunderbolt, {
  executor: starmie,
  target: heatran
})

heatran.setEv('spDef',100)
starmie.setEv('spAtk', 200)

console.log('starmie',starmie.evs)
console.log('heatran' ,heatran.evs)
console.log(moveDict.thunderbolt)
console.log("starmie => thunderbolt => heatran")
const list = [...Array(1000)].map(() => moveExecuted.calcBasePower())
console.log(list.sort())
