
export declare module VTStyle {
  type Object = { [key: string | number]: VTStyle.Value };
  type Value = Object | string | number | boolean | null
  type Walker = (key: string | number, value: VTStyle.Value, parent: Object) => void
}
