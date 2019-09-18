export const START_HARD_LOAD = 'START_HARD_LOAD'
export const STOP_HARD_LOAD = 'STOP_HARD_LOAD'

export function startHardLoad(task) {
  return {
    type: START_HARD_LOAD,
    payload: {
      task 
    }
  }
}

export function stopHardLoad(task) {
  return {
    type: STOP_HARD_LOAD,
    payload: {
      task
    }
  }
}