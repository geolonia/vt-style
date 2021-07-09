/**
 * Cache store
 */
const variables: { [key: string]: VT.Value } = {}

/**
 * VTStyle filter to enable variables which start with `$`
 */
export const variableFilter: VT.Filter = (key, value, parent) => {
  // store a cache
  if (typeof key === 'string' && !Array.isArray(parent) && key.startsWith('$')) {
    variables[key] = value
    return
  }

  // get a cache
  if (typeof value === 'string' && value !== key && value in variables) {
    return variables[value]
  } else {
    return value
  }
}
