export const sendEmailValidationSchema = {
  tags: ['Email Validation'],
  summary: 'Send email validation',
  description: 'Send validation code to email address',
  body: {
    type: 'object',
    required: ['email'],
    properties: {
      email: { type: 'string', format: 'email' }
    }
  },
  response: {
    204: {
      type: 'null',
      description: 'Email validation sent successfully'
    },
    422: {
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' }
      }
    }
  }
}
