import { Slug } from './slug.vo'

describe('Slug', () => {
  it('should create a slug from a string without changes', () => {
    const slug = Slug.create('example-question-title')

    expect(slug.value).toBe('example-question-title')
  })

  it('should create a slug from a capitalized string', () => {
    const slug = Slug.create('Example Question Title')

    expect(slug.value).toBe('example-question-title')
  })

  it('should normalize text with accented characters', () => {
    const slug = Slug.create('Título com Acentos')

    expect(slug.value).toBe('titulo-com-acentos')
  })

  it('should replace spaces and underscores with hyphens', () => {
    const slug = Slug.create('text_with underscores and spaces')

    expect(slug.value).toBe('text-with-underscores-and-spaces')
  })

  it('should remove non-alphanumeric characters', () => {
    const slug = Slug.create('Text @with# symbols$')

    expect(slug.value).toBe('text-with-symbols')
  })

  it('should replace multiple consecutive hyphens with a single hyphen', () => {
    const slug = Slug.create('Text---with--multiple---hyphens')

    expect(slug.value).toBe('text-with-multiple-hyphens')
  })

  it('should trim hyphens at the start and end', () => {
    const slug = Slug.create('-Text with hyphens-')

    expect(slug.value).toBe('text-with-hyphens')
  })
})
