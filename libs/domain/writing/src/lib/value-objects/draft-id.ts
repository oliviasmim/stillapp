export class DraftId {
  private constructor(readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('DraftId cannot be empty');
    }
  }

  static of(value: string): DraftId {
    return new DraftId(value);
  }

  static generate(): DraftId {
    return new DraftId(crypto.randomUUID());
  }

  equals(other: DraftId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
