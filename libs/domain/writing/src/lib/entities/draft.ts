import { DraftId } from '../value-objects/draft-id';
import { Content } from '../value-objects/content';
import { DraftSaved } from '../events/draft-saved';
import { DraftDiscarded } from '../events/draft-discarded';

export type DraftStatus = 'active' | 'archived' | 'discarded';

export interface DraftProps {
  id: DraftId;
  title: string;
  content: Content;
  status: DraftStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class Draft {
  private readonly _events: Array<DraftSaved | DraftDiscarded> = [];

  private constructor(private readonly props: DraftProps) {}

  static create(id: DraftId, title: string, content: Content): Draft {
    const now = new Date();
    return new Draft({ id, title, content, status: 'active', createdAt: now, updatedAt: now });
  }

  static reconstitute(props: DraftProps): Draft {
    return new Draft(props);
  }

  get id(): DraftId { return this.props.id; }
  get title(): string { return this.props.title; }
  get content(): Content { return this.props.content; }
  get status(): DraftStatus { return this.props.status; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }
  get domainEvents() { return [...this._events]; }

  updateContent(content: Content, title?: string): void {
    this.props.content = content;
    if (title !== undefined) this.props.title = title;
    this.props.updatedAt = new Date();
    this._events.push(new DraftSaved(this.props.id.value, this.props.updatedAt));
  }

  discard(): void {
    this.props.status = 'discarded';
    this.props.updatedAt = new Date();
    this._events.push(new DraftDiscarded(this.props.id.value, this.props.updatedAt));
  }

  archive(): void {
    this.props.status = 'archived';
    this.props.updatedAt = new Date();
  }

  clearEvents(): void {
    this._events.length = 0;
  }
}
