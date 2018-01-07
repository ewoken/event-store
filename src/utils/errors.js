export class DomainError extends Error {
  constructor (domainName, message, payload) {
    super(`${domainName}: ${message}`)
    this.domainName = domainName
    this.payload = payload
  }
}
