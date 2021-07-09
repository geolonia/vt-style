import jsYaml from "js-yaml";
import { variableFilter } from "./filters/variable";

/**
 * Type guard to detect valid values
 */
const isVTStyleValue = (object: any): object is VT.Value => {
  return Array.isArray(object) ||
    typeof object === 'object' ||
    typeof object === 'string' ||
    typeof object === 'number' ||
    typeof object === 'boolean' ||
    object === null
}

/**
 * YAML -> JSON Transpiler
 */
export class Transpiler {
  private yaml: string
  private options: VT.Options
  private json: string = ""
  private object: VT.Value = null

  /**
   * an experimental utility
   */
  static _json2yaml = (json: string) => {
    return jsYaml.dump(jsYaml.load(json, { schema: jsYaml.JSON_SCHEMA }))
  }

  /**
   * default opitions for a Tranpiler instance
   */
  static defaultOptions: VT.Options = {
    minify: false,
    filters: [variableFilter]
  }

  /**
   * create transpiler instance with options
   */
  constructor(yaml: string, options: Partial<VT.Options> = {}) {
    this.yaml = yaml;
    this.options = { ...Transpiler.defaultOptions, ...options }
    this.transpile()
  }

  /**
   * parse given yaml
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
   * traverse parsed object recursively and apply filter functions
   */
  private traverse(parent = this.object) {
    if (typeof parent === 'object' && parent !== null) {
      for (const key in parent) {
        const nextValue = this.options.filters.reduce(
          // @ts-ignore
          (prev, filter) => filter(key, prev, parent),
          // @ts-ignore
          parent[key],
        )
        // @ts-ignore
        parent[key] = nextValue
        if (typeof nextValue === 'object' && nextValue !== null && nextValue !== undefined) {
          this.traverse(nextValue)
        }
      }
    }
    return parent
  }

  /**
   * generate output JSON
   */
  private generate() {
    if (this.options.minify) {
      this.json = JSON.stringify(this.object)
    } else {
      this.json = JSON.stringify(this.object, null, 2);
    }
  }

  /**
   * return JSON text
   */
  toText() {
    return this.json
  }

  /**
   * return parsed object
   */
  toJSON() {
    return this.object
  }
  /**
   * return YAML text
   */
  toYAML() {
    return this.yaml
  }

  /**
   * run transpile
   */
  private transpile() {
    this.parse()
    this.traverse()
    this.generate()
    return this
  }
}

if (global.window) {
  // @ts-ignore
  const VT = { ...global.window.VT, Transpiler }
  // @ts-ignore
  global.window.VT = VT
}
