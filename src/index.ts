import jsYaml from "js-yaml";
import { variableFilter } from "./filters/variable";
import { includeFilter } from "./filters/include";

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
  private filterOptions: VT.FilterOptions
  private json: string = ""
  private object: VT.Value = null

  /**
   * an experimental utility
   */
  static _json2yaml = (json: string) => {
    return jsYaml.dump(jsYaml.load(json, { schema: jsYaml.JSON_SCHEMA }))
  }

  /**
   * default filters
   */
  static defaultFilters = { variableFilter, includeFilter }

  /**
   * default opitions for a Tranpiler instance
   */
  static defaultOptions: VT.Options = {
    minify: false,
    filters: Object.values(Transpiler.defaultFilters)
  }

  static defaultFilterOptions: VT.FilterOptions = {
    yamlParentDir: null
  }

  /**
   * create transpiler instance with options
   */
  constructor(
    yaml: string,
    options: Partial<VT.Options> = {},
    filterOptions: Partial<VT.FilterOptions> = {},
  ) {
    this.yaml = yaml;
    this.options = { ...Transpiler.defaultOptions, ...options }
    this.filterOptions = { ...Transpiler.defaultFilterOptions, ...filterOptions }
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
  private async traverse(parent = this.object) {
    if (typeof parent === 'object' && parent !== null) {
      for (const key in parent) {
        const nextValue = await this.options.filters.reduce(
          // @ts-ignore
          async (prevPromise, filter) => filter(
            key,
            await prevPromise,
            parent,
            this.options,
            this.filterOptions
          ),
          // @ts-ignore
          Promise.resolve(parent[key]),
        )
        // @ts-ignore
        parent[key] = nextValue
        if (typeof nextValue === 'object' && nextValue !== null && nextValue !== undefined) {
          await this.traverse(nextValue)
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
  async transpile() {
    this.parse()
    await this.traverse()
    this.generate()
    return this.toJSON()
  }
}

if (global.window) {
  // @ts-ignore
  const VT = { ...global.window.VT, Transpiler }
  // @ts-ignore
  global.window.VT = VT
}
