export const START_HARD_LOAD = 'START_HARD_LOAD'
export const STOP_HARD_LOAD = 'STOP_HARD_LOAD'

export function startHardLoad() {
  return {
    type: START_HARD_LOAD,
  }
}

export function stopHardLoad() {
  return {
    type: STOP_HARD_LOAD,
  }
}