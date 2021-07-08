import { VT } from '.'
import { Transpiler } from './vt-style'

test('should convert yaml to json', () => {
  const yaml = [
    'hello: &text world',
    'bye: *text',
  ].join('\n')

  const transpiler = new Transpiler(yaml)
  const object = transpiler.transpile()
  expect(object).toEqual({ hello: "world", bye: "world" })
})

test('should work with cusutom walk function', () => {
  const yaml = [
    'foo: 1',
    'bar: 2',
    'baz: 3',
  ].join('\n')
  const walk: VT.Filter = (_key, value) => {
    if (typeof value === 'number') {
      return value + 1
    } else {
      return value
    }
  }

  const transpiler = new Transpiler(yaml, walk)
  const object = transpiler.transpile()
  expect(object).toEqual({ foo: 2, bar: 3, baz: 4 })
})

test('should work with variable by default', () => {
  const yaml = [
    '$color: red',
    'foo: $color',
  ].join('\n')
  const walk: VT.Filter = (_key, value) => {
    if (typeof value === 'number') {
      return value + 1
    } else {
      return value
    }
  }

  const transpiler = new Transpiler(yaml)
  const object = transpiler.transpile()
  expect(object).toEqual({ foo: "red" })
})
