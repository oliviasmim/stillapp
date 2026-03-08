export class DraftSaved {
  readonly type = 'DraftSaved' as const;

  constructor(
    readonly draftId: string,
    readonly savedAt: Date,
  ) {}
}
