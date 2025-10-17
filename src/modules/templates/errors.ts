import NotFound from '@/utils/errors/NotFound'

export class TemplateNotFound extends NotFound {
  constructor(message = 'Template not found') {
    super(message)
  }
}
