import { objectMatches } from './glob.match'

describe('objectMatches', () => {
  test('matches an object', () => {
    expect(objectMatches({ foo: 'bar' }, { foo: 'bar' })).toBe(true)
    expect(objectMatches({ foo: ['bar', 'baz'] }, { foo: 'bar' })).toBe(true)
  })

  test('denies an object with no exact match', () => {
    expect(objectMatches({ foo: 'bar' }, { foo: 'bar', baz: 'bar' })).toBe(
      false
    )
  })

  test('accepts an object with one of a match', () => {
    expect(objectMatches({ foo: 'bar' }, { foo: ['bar', 'baz'] })).toBe(true)
    expect(
      objectMatches({ foo: ['bar', 'crux'] }, { foo: ['bar', 'baz'] })
    ).toBe(true)
  })

  test('accepts an object with wildcard match', () => {
    expect(objectMatches({ foo: 'name:bar' }, { foo: 'name:*' })).toBe(true)
    expect(objectMatches({ foo: 'name:bar' }, { foo: '*:*' })).toBe(true)
    expect(objectMatches({ foo: 'name:bar' }, { foo: '*:bar' })).toBe(true)
    expect(objectMatches({ foo: 'name:bar' }, { foo: '**' })).toBe(true)

    expect(
      objectMatches({ foo: ['name:bar', 'smth:bar'] }, { foo: 'name:*' })
    ).toBe(true)
    expect(
      objectMatches({ foo: ['name:bar', 'smth:bar'] }, { foo: '*:*' })
    ).toBe(true)
    expect(
      objectMatches({ foo: ['name:bar', 'smth:bar'] }, { foo: '*:bar' })
    ).toBe(true)
    expect(
      objectMatches({ foo: ['name:bar', 'smth:bar'] }, { foo: '**' })
    ).toBe(true)
  })

  test('denies an object with no wildcard match', () => {
    expect(objectMatches({ foo: 'title:bar' }, { foo: 'name:*' })).toBe(false)
    expect(objectMatches({ foo: 'name:bar' }, { foo: '*:baz' })).toBe(false)

    expect(
      objectMatches({ foo: ['title:bar', 'cool:cat'] }, { foo: 'name:*' })
    ).toBe(false)
    expect(
      objectMatches({ foo: ['name:bar', 'cool:cat'] }, { foo: '*:baz' })
    ).toBe(false)
  })

  test('accepts an object with one of a wildcard match', () => {
    expect(
      objectMatches({ foo: 'name:bar' }, { foo: ['name:*', 'title:*'] })
    ).toBe(true)
    expect(
      objectMatches(
        { foo: ['name:bar', 'pork:bar'] },
        { foo: ['name:*', 'title:*'] }
      )
    ).toBe(true)
  })

  test('denies an object with none of a wildcard match', () => {
    expect(
      objectMatches({ foo: 'pork:bar' }, { foo: ['name:*', 'title:*'] })
    ).toBe(false)
    expect(
      objectMatches(
        { foo: ['pork:bar', 'crinkle:cut'] },
        { foo: ['name:*', 'title:*'] }
      )
    ).toBe(false)
  })
})
