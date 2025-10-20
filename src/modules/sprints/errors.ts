import NotFound from '@/utils/errors/NotFound'

export class SprintNotFound extends NotFound {
  constructor(message = 'Sprint not found') {
    super(message)
  }
}
