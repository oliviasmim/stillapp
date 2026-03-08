import { LibraryItemId } from '../value-objects/library-item-id';
import { SourceUrl } from '../value-objects/source-url';
import { Annotation } from '../value-objects/annotation';

export type LibraryItemKind = 'bookmark' | 'voice-memo' | 'note' | 'highlight';

export interface LibraryItemProps {
  id: LibraryItemId;
  kind: LibraryItemKind;
  title: string;
  content: string;
  sourceUrl: SourceUrl | null;
  annotations: Annotation[];
  tags: string[];
  embeddingId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class LibraryItem {
  private constructor(private readonly props: LibraryItemProps) {}

  static create(
    id: LibraryItemId,
    kind: LibraryItemKind,
    title: string,
    content: string,
    sourceUrl?: SourceUrl,
  ): LibraryItem {
    const now = new Date();
    return new LibraryItem({
      id,
      kind,
      title,
      content,
      sourceUrl: sourceUrl ?? null,
      annotations: [],
      tags: [],
      embeddingId: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: LibraryItemProps): LibraryItem {
    return new LibraryItem(props);
  }

  get id(): LibraryItemId { return this.props.id; }
  get kind(): LibraryItemKind { return this.props.kind; }
  get title(): string { return this.props.title; }
  get content(): string { return this.props.content; }
  get sourceUrl(): SourceUrl | null { return this.props.sourceUrl; }
  get annotations(): Annotation[] { return [...this.props.annotations]; }
  get tags(): string[] { return [...this.props.tags]; }
  get embeddingId(): string | null { return this.props.embeddingId; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  annotate(text: string, highlightedRange?: [number, number]): void {
    this.props.annotations.push(new Annotation(text, highlightedRange));
    this.props.updatedAt = new Date();
  }

  tag(tag: string): void {
    if (!this.props.tags.includes(tag)) {
      this.props.tags.push(tag);
      this.props.updatedAt = new Date();
    }
  }

  attachEmbedding(embeddingId: string): void {
    this.props.embeddingId = embeddingId;
    this.props.updatedAt = new Date();
  }
}
