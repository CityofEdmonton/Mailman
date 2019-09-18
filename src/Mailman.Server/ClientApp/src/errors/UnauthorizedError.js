export default class UnauthorizedError extends Error {
  constructor(...params) {
    super(...params)

    this.status = 401
  }
}
