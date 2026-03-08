export class Content {
  private constructor(
    readonly raw: string,
    readonly wordCount: number,
  ) {}

  static of(raw: string): Content {
    const wordCount = raw.trim() === '' ? 0 : raw.trim().split(/\s+/).length;
    return new Content(raw, wordCount);
  }

  static empty(): Content {
    return new Content('', 0);
  }

  get isEmpty(): boolean {
    return this.raw.trim().length === 0;
  }

  equals(other: Content): boolean {
    return this.raw === other.raw;
  }
}
