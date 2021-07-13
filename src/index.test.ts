import { Transpiler } from '.'

test('should convert yaml to json', async () => {
  const yaml = [
    'hello: &text world',
    'bye: *text',
  ].join('\n')

  const transpiler = new Transpiler(yaml)
  const style = await transpiler.transpile()
  expect(style).toEqual({ hello: "world", bye: "world" })
})

test('should work with a cusutom filter function', async () => {
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
  const style = await transpiler.transpile()
  expect(style).toEqual({ foo: 2, bar: 3, baz: 4 })
})

test('should work with a cusutom async filter function', async () => {
  const yaml = [
    'foo: 1',
    'bar: hello',
  ].join('\n')
  const sleep = (msec: number) => new Promise(resolve => setTimeout(resolve, msec))
  const asyncIncrementFilter: VT.Filter = async (_key, value) => {
    await sleep(100)
    if (typeof value === 'number') {
      return value + 1
    } else {
      return value
    }
  }

  const transpiler = new Transpiler(yaml, { filters: [asyncIncrementFilter] })
  const style = await transpiler.transpile()
  expect(style).toEqual({ foo: 2, bar: 'hello' })
})

test('should work with multiple cusutom filter functions', async () => {
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
  const style = await transpiler.transpile()
  expect(style).toEqual({ foo: 4, bar: 9, baz: 16 })
})

test('should work with variable filter by default', async () => {
  const yaml = [
    '$color: red',
    'foo: $color',
  ].join('\n')

  const transpiler = new Transpiler(yaml)
  const style = await transpiler.transpile()
  expect(style).toEqual({ foo: "red" })
})

test('should work with include filter by default', async () => {
  const yaml = [
    'foo: "!include ./__test__/assets/includable.yml"',
  ].join('\n')

  const transpiler = new Transpiler(yaml, {}, { yamlParentDir: './' })
  const style = await transpiler.transpile()
  expect(style).toEqual({ foo: { hello: { world: 123 } } })
})

