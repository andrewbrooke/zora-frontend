// Custom error type to encapsulate all errors
export class ZFError extends Error {
  statusCode!: number
}

export class BadRequestError extends ZFError {
  constructor(message: string) {
    super(message)
    this.message = message
    this.statusCode = 400
  }
}

export class InternalServerError extends ZFError {
  constructor() {
    const message = 'We are sorry, an internal server error occurred.'
    super(message)
    this.message = message
    this.statusCode = 500
  }
}
