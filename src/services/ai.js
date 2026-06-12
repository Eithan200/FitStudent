// ─────────────────────────────────────────────────────────────
// AI integration stubs — Phase 1 returns mock data.
// Every function keeps the exact signature Phase 2 will need,
// so swapping in real calls is a body-only change.
// ─────────────────────────────────────────────────────────────
import { foodResults, recipes, planTemplates, defaultVariant } from '../data/mockData'
import { DAY_KEYS } from '../utils/dates'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// PHASE 2: POST to Make.com webhook at https://hook.make.com/<scenario-A-food-analysis>
// body: { image_base64, user_id, meal_type } → Claude Vision + Perplexity verified JSON
export async function analyzeFoodImage(imageBase64) {
  await sleep(2000) // simulate Claude Vision latency
  return foodResults[Math.floor(Math.random() * foodResults.length)]
}

// PHASE 2: POST to Make.com webhook at https://hook.make.com/<scenario-B-fridge-recipe>
// body: { image_base64, user_id } → Claude Vision ingredients → Claude recipe → Imagen image
export async function generateRecipeFromFridge(imageBase64) {
  await sleep(3000) // simulate full Scenario B chain latency
  return recipes[Math.floor(Math.random() * recipes.length)]
}

// PHASE 2: POST image to Make.com Scenario B step 1 → Claude Vision returns the
// list of ingredients it detected in the fridge photo (user can then correct it).
export async function detectFridgeIngredients(imageBase64) {
  await sleep(2500)
  const r = recipes[Math.floor(Math.random() * recipes.length)]
  // mock: surface the chosen recipe's ingredients as if "detected", plus staples
  return r.ingredients.slice(0, 5)
}

// PHASE 2: POST the (corrected) ingredient list to Make.com → Claude builds a
// recipe from exactly those ingredients. Phase 1 returns a close mock match.
export async function recipeFromIngredients(ingredients) {
  await sleep(2000)
  const ranked = rankRecipesByIngredients(ingredients)
  return ranked[0]?.recipe || recipes[Math.floor(Math.random() * recipes.length)]
}

// Hebrew-ish loose word match: share a 3-char root prefix
const _root = (w) => w.replace(/[0-9״"׳']/g, '').trim()
const _words = (s) => s.split(/[\s,]+/).map(_root).filter((w) => w.length >= 3)
const _shareRoot = (a, b) => a.slice(0, 3) === b.slice(0, 3)

// Rank recipes by overlap with the user's ingredients. Returns
// { recipe, have:[], missing:[], needsExtra } sorted: most overlap first,
// then recipes missing only a few easy-to-buy items (needsExtra=true).
export function rankRecipesByIngredients(ingredients) {
  const userWords = (ingredients || []).flatMap(_words)
  if (userWords.length === 0) return []
  const scored = recipes
    .map((r) => {
      const have = []
      const missing = []
      r.ingredients.forEach((ing) => {
        const matched = _words(ing).some((w) => userWords.some((u) => _shareRoot(u, w)))
        if (matched) have.push(ing)
        else missing.push(ing)
      })
      return { recipe: r, have, missing, needsExtra: missing.length > 0 }
    })
    .filter((s) => s.have.length > 0)
  scored.sort((a, b) => b.have.length - a.have.length || a.missing.length - b.missing.length)
  return scored
}

// PHASE 2: posts the ingredient list and returns ranked matches.
export async function suggestRecipesFromIngredients(ingredients) {
  await sleep(1800)
  return rankRecipesByIngredients(ingredients)
}

// PHASE 2: replace with Gemini API call via Make.com Scenario E
// ("Create a personalized weekly workout plan... Return JSON {monday:{...}}")
// Phase 1: static template generator — picks a preset weekly template by
// discipline + experience, schedules workouts_per_week training days.
export function generateWorkoutPlan({ experience, workouts_per_week, workout_type = 'gym' }) {
  const discipline = planTemplates[workout_type] || planTemplates.gym
  const variant = defaultVariant(workout_type, experience)
  const template = discipline[variant] || Object.values(discipline)[0]
  const count = Math.min(Math.max(workouts_per_week || 3, 1), 6)

  // spread training days evenly across sunday..saturday
  const slots = {
    1: [0],
    2: [0, 3],
    3: [0, 2, 4],
    4: [0, 1, 3, 4],
    5: [0, 1, 2, 4, 5],
    6: [0, 1, 2, 3, 4, 5],
  }[count]

  return DAY_KEYS.map((day, i) => {
    const slotIndex = slots.indexOf(i)
    if (slotIndex === -1) {
      return { day_of_week: day, workout_name: 'מנוחה', muscle_groups: '', exercises: [], workout_type, workout_variant: variant }
    }
    const workout = template[slotIndex % template.length]
    return {
      day_of_week: day,
      workout_name: workout.workout_name,
      muscle_groups: workout.muscle_groups,
      exercises: workout.exercises,
      workout_type,
      workout_variant: variant,
    }
  })
}

// All recommended workouts available for a discipline + variant, so the user
// can choose among several instead of getting one arbitrary suggestion.
export function recommendationsFor(workout_type, variant) {
  const disc = planTemplates[workout_type] || planTemplates.gym
  return disc[variant] || Object.values(disc)[0] || []
}

// Build a single day's workout from a discipline + variant (level/style) — used
// when the user mixes disciplines across the week or edits a single day.
export function workoutForDiscipline(workout_type, variant, index = 0) {
  const disc = planTemplates[workout_type] || planTemplates.gym
  const tmpl = disc[variant] || Object.values(disc)[0]
  const w = tmpl[Math.abs(index) % tmpl.length]
  return {
    workout_name: w.workout_name,
    muscle_groups: w.muscle_groups,
    exercises: w.exercises,
    workout_type,
    workout_variant: variant,
  }
}

// PHASE 2: POST to Make.com webhook for Telegram daily-report registration
export async function registerTelegram(telegramId) {
  await sleep(300)
  return { ok: true }
}

// Haptic feedback stub — Phase 2: navigator.vibrate patterns per event type
export function haptic(kind = 'light') {
  // intentionally a no-op in Phase 1
}
