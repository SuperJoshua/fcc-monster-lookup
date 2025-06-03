"use strict"

const el_search_input = document.getElementById('search-input')
const el_search_button = document.getElementById('search-button')

const el_stats = {
   'name': document.getElementById('pokemon-name'),
   'id': document.getElementById('pokemon-id'),
   'weight': document.getElementById('weight'),
   'height': document.getElementById('height'),
   'types': document.getElementById('types'),
   'hp': document.getElementById('hp'),
   'attack': document.getElementById('attack'),
   'defense': document.getElementById('defense'),
   's_attack': document.getElementById('special-attack'),
   's_defense': document.getElementById('special-defense'),
   'speed': document.getElementById('speed')
}

// What's fanfare for? I thought to do some silly animations, but, then, after completing the project, I thought "Why?" I don't actually care about Pokemon. 
const el_fanfare =   document.getElementById('fanfare')
const el_image = document.getElementById('image')

function clear_results() {
   const keys = Object.keys(el_stats)
   for (const k of keys) {
      el_stats[k].textContent = ''
   }
   el_fanfare.classList.toggle('hidden')
   el_image.innerHTML = ''
}

function clean_input() {
   let pokemon = el_search_input.value.trim()
   pokemon = pokemon.toLowerCase()
   const convert_spaces_re = / /g
   pokemon = pokemon.replace(convert_spaces_re, '-')
   const clean_re = /[^\d\w-]/g
   pokemon = pokemon.replace(clean_re, '')
   return pokemon
}

async function get_pokemon(pokemon) {
   const url = "https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/"
   try {
      const response = await fetch(`${url}${pokemon}`)
      if (!response.ok) {
         throw new Error(`Response status: ${response.status}`)
      }
      const json = await response.json()
      set_stats(json)
   } catch (error) {
      alert("Pokémon not found")
   }
}

function set_stats(data) {
   el_fanfare.classList.toggle('hidden')
   el_image.innerHTML = `<img id="sprite" src="${data['sprites']['front_default']}" alt="a ${data['name']}, presumably">`
   el_stats['name'].textContent = data['name']
   el_stats['id'].textContent = data['id']
   el_stats['height'].textContent = data['height']
   el_stats['weight'].textContent = data['weight']

   // What the hell...
   for (let i = 0; i < data['types'].length; i += 1) {
      el_stats['types'].innerHTML += `<div>${data['types'][i]['type']['name'].toUpperCase()}</div>`
   }

   // What nutjob decided to ecode stats with an index instead of a string? 0 instead of hp, 1 instead of attack...
   el_stats['hp'].textContent = data['stats'][0]['base_stat']
   el_stats['attack'].textContent = data['stats'][1]['base_stat']
   el_stats['defense'].textContent = data['stats'][2]['base_stat']
   el_stats['s_attack'].textContent = data['stats'][3]['base_stat']
   el_stats['s_defense'].textContent = data['stats'][4]['base_stat']
   el_stats['speed'].textContent = data['stats'][5]['base_stat']
}

function process_input() {
   clear_results()
   const pokemon = clean_input()
   if (!pokemon) {return}
   get_pokemon(pokemon)
}

el_search_button.addEventListener('click', process_input)
