import { VTStyle } from '..'

const variables: { [key: string]: VTStyle.Value } = {}

export const variableWalker: VTStyle.Walker = (key, value, parent) => {
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
