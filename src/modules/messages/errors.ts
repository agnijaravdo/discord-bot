import NotFound from '@/utils/errors/NotFound'

export class MessageNotFound extends NotFound {
  constructor(message = 'Message not found') {
    super(message)
  }
}
