import axios from 'axios'
import type { IPokemon, PokemonSpecies } from './type.js'

const API_BASEURL = "https://pokeapi.co/api/v2"
const api = axios.create({
  baseURL: API_BASEURL
})


export async function getPokemon (name: string) {
  return (await api.get<IPokemon>(`/pokemon/${name}`)).data
}

export async function getSpecies (name: string) {
  return (await api.get<PokemonSpecies>(`/pokemon-species/${name}`)).data
}