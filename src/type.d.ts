declare namespace VT {
  type Object = { [key: string | number]: VT.Value }; // object or array
  type Value = VT.Object | string | number | boolean | null
  type Filter = (key: string | number, value: VT.Value, parent: VT.Object, options: FilterOptions) => void | VT.Value | Promise<void | VT.Value>
  interface Options {
    minify: boolean,
    filters: Filter[]
  }
  interface FilterOptions {
    yamlPath: string
  }
}
