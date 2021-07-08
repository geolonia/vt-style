import { VT } from '..'

const variables: { [key: string]: VT.Value } = {}

export const variableFilter: VT.Filter = (key, value, parent) => {
  if (typeof key === 'string' && !Array.isArray(parent) && key.startsWith('$')) {
    variables[key] = value
    return
  }

  if (typeof value === 'string' && value !== key && value in variables) {
    return variables[value]
  } else {
    return value
  }
}
