export const SUBMIT_ERROR = 'SUBMIT_ERROR'

export function submitError(error) {
  return {
    type: SUBMIT_ERROR,
    payload: {
      error,
    },
  }
}