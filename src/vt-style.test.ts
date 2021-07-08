import { VTStyle } from '.'
import { VTStyleCore } from './vt-style'

test('should convert yaml to json', () => {
  const yaml = [
    'hello: &text world',
    'bye: *text',
  ].join('\n')

  const vtStyleCore = new VTStyleCore(yaml)
  const object = vtStyleCore.transpile()
  expect(object).toEqual({ hello: "world", bye: "world" })
})

test('should work with cusutom walker function', () => {
  const yaml = [
    'foo: 1',
    'bar: 2',
    'baz: 3',
  ].join('\n')
  const walker: VTStyle.Walker = (_key, value) => {
    if (typeof value === 'number') {
      return value + 1
    } else {
      return value
    }
  }

  const vtStyleCore = new VTStyleCore(yaml, walker)
  const object = vtStyleCore.transpile()
  expect(object).toEqual({ foo: 2, bar: 3, baz: 4 })

})
