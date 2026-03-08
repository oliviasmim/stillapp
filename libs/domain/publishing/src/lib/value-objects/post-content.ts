const TWITTER_MAX_CHARS = 280;

export class PostContent {
  readonly threads: string[];

  private constructor(threads: string[]) {
    if (threads.length === 0) throw new Error('PostContent must have at least one thread segment');
    for (const segment of threads) {
      if (segment.length > TWITTER_MAX_CHARS) {
        throw new Error(`Thread segment exceeds ${TWITTER_MAX_CHARS} characters`);
      }
    }
    this.threads = threads;
  }

  static single(text: string): PostContent {
    return new PostContent([text]);
  }

  static thread(segments: string[]): PostContent {
    return new PostContent(segments);
  }

  get isThread(): boolean { return this.threads.length > 1; }
  get charCount(): number { return this.threads.reduce((sum, s) => sum + s.length, 0); }
}
