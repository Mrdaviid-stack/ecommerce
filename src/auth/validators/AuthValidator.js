import { body, validationResult } from 'express-validator'

export const AuthRules = () => {
  return [
    body('identity')
      .notEmpty()
      .withMessage('Indentity not be Empty.')
      .isLength({ min: 5 })
      .withMessage('identity length minimum is 5'),

    body('password')
      .notEmpty()
      .withMessage('Password not be Empty.')
      .withMessage('Password must contain 1 Uppercase, LowerCase, Number, and 1 Special Characters')
  ]
}

export const Validate = (request, response, next) => {
  const errors = validationResult(request)
  if (errors.isEmpty())
    return next()

  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return response.status(422).json({ errors: extractedErrors })
}
