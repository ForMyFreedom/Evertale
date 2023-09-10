import { validator } from '@ioc:Adonis/Core/Validator'

validator.rule('negative', (value, _, options) => {
  if (typeof value !== 'number') {
    return
  }

  if (value > 0) {
    options.errorReporter.report(
      options.pointer,
      'negative',
      'negative validation failed',
      options.arrayExpressionPointer
    )
  }
})

validator.rule('percentage', (value, _, options) => {
  if (typeof value !== 'number') {
    return
  }

  if (value > 1 || value < 0) {
    options.errorReporter.report(
      options.pointer,
      'percentage',
      'percentage validation failed',
      options.arrayExpressionPointer
    )
  }
})