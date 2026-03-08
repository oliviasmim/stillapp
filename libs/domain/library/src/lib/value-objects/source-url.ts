export class SourceUrl {
  private constructor(readonly value: string) {
    try { new URL(value); } catch { throw new Error(`Invalid URL: ${value}`); }
  }
  static of(value: string): SourceUrl { return new SourceUrl(value); }
  get domain(): string { return new URL(this.value).hostname; }
  toString(): string { return this.value; }
}
