/**
 * VTStyle filter to enable variables which start with `$`
 */
export const includeFilter: VT.Filter = (key, value, _parent, filterOptions) => {
  // get a cache
  if (typeof value === 'string' && value.match(/^\!include (.*)$/)) {
    const { yamlPath } = filterOptions
  } else {
    return value
  }
}
