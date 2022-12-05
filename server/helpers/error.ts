// Custom error type to encapsulate all errors
export class ZGError extends Error {
  statusCode!: number
}

export class BadRequestError extends ZGError {
  constructor(message: string) {
    super(message)
    this.message = message
    this.statusCode = 400
  }
}

export class InternalServerError extends ZGError {
  constructor() {
    const message = 'We are sorry, an internal server error occurred.'
    super(message)
    this.message = message
    this.statusCode = 500
  }
}
