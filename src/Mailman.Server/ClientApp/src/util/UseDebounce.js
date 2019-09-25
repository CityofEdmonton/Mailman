/**
 * Waits 'wait' milliseconds before calling 'callback'. If the function
 * is called in the meantime, the timer is reset.
 * EX>
 * useDebounce(console.log, 1000)('Hello, world!')
 * @param {Function} callback The function to debounce.
 * @param {Number} wait The period of time to wait prior to calling the 
 * provided function.
 */
export default function useDebounce(callback, wait) {
  let timeout
  return function(...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {callback.apply(this, args)}, wait)
  }
}