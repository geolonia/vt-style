import jsYaml from "js-yaml";
import { VTStyle } from '.'

const isVTStyleValue = (object: any): object is VTStyle.Value => {
  return Array.isArray(object) ||
    typeof object === 'object' ||
    typeof object === 'string' ||
    typeof object === 'number' ||
    typeof object === 'boolean' ||
    object === null
}

/**
 * noop walker to traverse and transform values.
 */
const defaultWalker: VTStyle.Walker = (_key, value, _parent) => value;

/**
 * Plugable YAML -> JSON Transpiler
 */
export class VTStyleCore {
  private yaml: string
  private walks: VTStyle.Walker[]
  private json: string = ""
  private object: VTStyle.Value = null

  /**
   *
   * @param {string} yaml YAML format data
   * @param {function} walk
   */
  constructor(yaml: string, walks: VTStyle.Walker | VTStyle.Walker[] = defaultWalker) {
    this.yaml = yaml;
    if (Array.isArray(walks)) {
      this.walks = walks
    } else {
      this.walks = [walks];
    }
  }

  /**
   *
   * @returns {object} parsed YAML object
   */
  private parse() {
    const parsedObject = jsYaml.load(this.yaml);
    if (!isVTStyleValue(parsedObject)) {
      throw new Error('parse error')
    } else {
      this.object = parsedObject
      return this.object;
    }
  }

  /**
   * traverse object recursively and apply waker functions.
   * @param {object}
   * @returns
   */
  private traverse(parent = this.object) {
    if (typeof parent === 'object' && parent !== null) {
      for (const key in parent) {
        // @ts-ignore
        const nextValue = this.walks.reduce((prev, walk) => walk(key, prev, parent), parent[key])
        // @ts-ignore
        parent[key] = nextValue
        if (typeof nextValue === 'object' && nextValue !== null && nextValue !== undefined) {
          this.traverse(nextValue)
        }
      }
    }
    return parent
  }

  private generate() {
    this.json = JSON.stringify(this.object, null, 2);
  }

  toText() {
    return this.json
  }

  transpile() {
    this.parse()
    this.traverse()
    this.generate()
    return this.object
  }
}
