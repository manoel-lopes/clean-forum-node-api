export class Slug {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  public static create(value: string): Slug {
    return new Slug(value)
  }

  /**
   * Receives a string and normalize it as a slug.
   *
   * Example: "An example title" => "an-example-title"
   *
   * @param text {string}
   */
  public static createFromText(text: string): Slug {
    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/-$/g, '')

    return new Slug(slugText)
  }
}
