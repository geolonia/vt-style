import path from 'path'
import fs from 'fs/promises'
import { Transpiler } from '../'

/**
 * VTStyle filter to enable including syntax which start with `!include`
 */
export const includeFilter: VT.Filter = async (key, value, _parent, options, filterOptions) => {
  const { yamlParentDir } = filterOptions
  if (typeof value !== 'string' || !yamlParentDir) {
    return value
  }

  const match = value.match(/^\!include (.*)$/)
  if (!match) {
    return value
  } else {
    const yamlPath = match[1]
    const yamlFullPath = path.resolve(yamlParentDir, yamlPath)
    const yaml = await fs.readFile(yamlFullPath, 'utf-8')
    const { dir: childYamlParentDir } = path.parse(yamlFullPath)
    const transpiler = new Transpiler(yaml, options, { ...filterOptions, yamlParentDir: childYamlParentDir })
    return await transpiler.transpile()
  }
}
