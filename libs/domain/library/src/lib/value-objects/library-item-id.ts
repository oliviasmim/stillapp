export class LibraryItemId {
  private constructor(readonly value: string) {
    if (!value || value.trim().length === 0) throw new Error('LibraryItemId cannot be empty');
  }
  static of(value: string): LibraryItemId { return new LibraryItemId(value); }
  static generate(): LibraryItemId { return new LibraryItemId(crypto.randomUUID()); }
  equals(other: LibraryItemId): boolean { return this.value === other.value; }
  toString(): string { return this.value; }
}
