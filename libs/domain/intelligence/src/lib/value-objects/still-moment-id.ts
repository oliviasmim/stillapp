export class StillMomentId {
  private constructor(readonly value: string) {
    if (!value || value.trim().length === 0) throw new Error('StillMomentId cannot be empty');
  }
  static of(value: string): StillMomentId { return new StillMomentId(value); }
  static generate(): StillMomentId { return new StillMomentId(crypto.randomUUID()); }
  equals(other: StillMomentId): boolean { return this.value === other.value; }
  toString(): string { return this.value; }
}
