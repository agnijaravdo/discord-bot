export class MessageNotSavedError extends Error {
  constructor(message = 'Failed to create congratulatory message in database') {
    super(message)
  }
}

export class MessageNotSentError extends Error {
  constructor(message = 'Failed to send congratulatory message in discord') {
    super(message)
  }
}
