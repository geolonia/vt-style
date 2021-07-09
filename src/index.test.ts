import { Transpiler } from '.'

test('should convert yaml to json', () => {
  const yaml = [
    'hello: &text world',
    'bye: *text',
  ].join('\n')

  const transpiler = new Transpiler(yaml)
  const style = transpiler.transpile().toJSON()
  expect(style).toEqual({ hello: "world", bye: "world" })
})

test('should work with a cusutom filter function', () => {
  const yaml = [
    'foo: 1',
    'bar: 2',
    'baz: 3',
  ].join('\n')
  const incrementFilter: VT.Filter = (_key, value) => {
    if (typeof value === 'number') {
      return value + 1
    } else {
      return value
    }
  }

  const transpiler = new Transpiler(yaml, { filters: [incrementFilter] })
  const style = transpiler.transpile().toJSON()
  expect(style).toEqual({ foo: 2, bar: 3, baz: 4 })
})

test('should work with multiple cusutom filter functions', () => {
  const yaml = [
    'foo: 1',
    'bar: 2',
    'baz: 3',
  ].join('\n')
  const incrementFilter: VT.Filter = (_key, value) => {
    if (typeof value === 'number') {
      return value + 1
    } else {
      return value
    }
  }
  const squareFIlter: VT.Filter = (_key, value) => {
    if (typeof value === 'number') {
      return value ** 2
    } else {
      return value
    }
  }

  const transpiler = new Transpiler(yaml, { filters: [incrementFilter, squareFIlter] })
  const style = transpiler.transpile().toJSON()
  expect(style).toEqual({ foo: 4, bar: 9, baz: 16 })
})

test('should work with variable filter by default', () => {
  const yaml = [
    '$color: red',
    'foo: $color',
  ].join('\n')

  const transpiler = new Transpiler(yaml)
  const style = transpiler.transpile().toJSON()
  expect(style).toEqual({ foo: "red" })
})
