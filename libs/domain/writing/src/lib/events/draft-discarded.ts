export class DraftDiscarded {
  readonly type = 'DraftDiscarded' as const;

  constructor(
    readonly draftId: string,
    readonly discardedAt: Date,
  ) {}
}
