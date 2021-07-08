
export declare module VT {
  type Object = { [key: string | number]: VTStyle.Value };
  type Value = Object | string | number | boolean | null
  type Filter = (key: string | number, value: VTStyle.Value, parent: Object) => void
}
