import { Slug } from './slug.vo'

describe('Slug', () => {
  it('should be able to create a new slug from text', () => {
    const slug = Slug.createFromText('An example title')

    expect(slug.value).toEqual('an-example-title')
  })

  it('should be able to create a new slug from text with special characters', () => {
    const slug = Slug.createFromText('An example title with special characters!@#$%^&*()_+')

    expect(slug.value).toEqual('an-example-title-with-special-characters')
  })

  it('should be able to create a new slug from text with multiple spaces', () => {
    const slug = Slug.createFromText('An    example   title   with   multiple   spaces')

    expect(slug.value).toEqual('an-example-title-with-multiple-spaces')
  })

  it('should be able to create a new slug from text with leading and trailing spaces', () => {
    const slug = Slug.createFromText('   An example title with leading and trailing spaces   ')

    expect(slug.value).toEqual('an-example-title-with-leading-and-trailing-spaces')
  })

  it('should be able to create a new slug from text with numbers', () => {
    const slug = Slug.createFromText('An example title with numbers 123')

    expect(slug.value).toEqual('an-example-title-with-numbers-123')
  })

  it('should be able to create a new slug from text with accented characters', () => {
    const slug = Slug.createFromText('Um título de exemplo')

    expect(slug.value).toEqual('um-titulo-de-exemplo')
  })
})
