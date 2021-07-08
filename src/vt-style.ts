import jsYaml from "js-yaml";
import { VT } from '.'
import { variableFilter } from "./filters/variable";

const isVTStyleValue = (object: any): object is VT.Value => {
  return Array.isArray(object) ||
    typeof object === 'object' ||
    typeof object === 'string' ||
    typeof object === 'number' ||
    typeof object === 'boolean' ||
    object === null
}

/**
 * Plugable YAML -> JSON Transpiler
 */
export class Transpiler {
  private yaml: string
  private walks: VT.Filter[]
  private json: string = ""
  private object: VT.Value = null

  static json2yaml = (json: string) => {
    return jsYaml.dump(jsYaml.load(json, { schema: jsYaml.JSON_SCHEMA }))
  }

  /**
   *
   * @param {string} yaml YAML format data
   * @param {function} walk
   */
  constructor(yaml: string, walks: VT.Filter | VT.Filter[] = variableFilter) {
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

// @ts-ignore
global.window && (global.window.Transpiler = Transpiler)
