export class SimilarityScore {
  private constructor(readonly value: number) {
    if (value < 0 || value > 1) throw new Error(`SimilarityScore must be between 0 and 1, got ${value}`);
  }
  static of(value: number): SimilarityScore { return new SimilarityScore(value); }
  get isStrong(): boolean { return this.value >= 0.85; }
  get isModerate(): boolean { return this.value >= 0.70 && this.value < 0.85; }
  compareTo(other: SimilarityScore): number { return this.value - other.value; }
  toString(): string { return this.value.toFixed(4); }
}
