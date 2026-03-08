export class Annotation {
  readonly createdAt: Date;

  constructor(
    readonly text: string,
    readonly highlightedRange?: [number, number],
  ) {
    if (!text || text.trim().length === 0) throw new Error('Annotation text cannot be empty');
    this.createdAt = new Date();
  }
}
