export class PostId {
  private constructor(readonly value: string) {
    if (!value || value.trim().length === 0) throw new Error('PostId cannot be empty');
  }
  static of(value: string): PostId { return new PostId(value); }
  static generate(): PostId { return new PostId(crypto.randomUUID()); }
  equals(other: PostId): boolean { return this.value === other.value; }
  toString(): string { return this.value; }
}
