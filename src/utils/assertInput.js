import { ValidationError } from './errors'

export default function assertInput (schema, inputValue) {
  const { error, value } = schema.validate(inputValue)
  if (error) {
    throw new ValidationError(error.message, error.details, error._object)
  }
  return value
}
