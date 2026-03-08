import { PostId } from '../value-objects/post-id';
import { PostContent } from '../value-objects/post-content';

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed';
export type PublishingPlatform = 'twitter_x';

export interface PostProps {
  id: PostId;
  draftId: string;
  platform: PublishingPlatform;
  content: PostContent;
  status: PostStatus;
  scheduledFor: Date | null;
  publishedAt: Date | null;
  platformPostId: string | null;
  failureReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Post {
  private constructor(private readonly props: PostProps) {}

  static create(
    id: PostId,
    draftId: string,
    platform: PublishingPlatform,
    content: PostContent,
  ): Post {
    const now = new Date();
    return new Post({
      id,
      draftId,
      platform,
      content,
      status: 'draft',
      scheduledFor: null,
      publishedAt: null,
      platformPostId: null,
      failureReason: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: PostProps): Post {
    return new Post(props);
  }

  get id(): PostId { return this.props.id; }
  get draftId(): string { return this.props.draftId; }
  get platform(): PublishingPlatform { return this.props.platform; }
  get content(): PostContent { return this.props.content; }
  get status(): PostStatus { return this.props.status; }
  get scheduledFor(): Date | null { return this.props.scheduledFor; }
  get publishedAt(): Date | null { return this.props.publishedAt; }
  get platformPostId(): string | null { return this.props.platformPostId; }
  get failureReason(): string | null { return this.props.failureReason; }

  markPublished(platformPostId: string): void {
    this.props.status = 'published';
    this.props.platformPostId = platformPostId;
    this.props.publishedAt = new Date();
    this.props.updatedAt = new Date();
  }

  markFailed(reason: string): void {
    this.props.status = 'failed';
    this.props.failureReason = reason;
    this.props.updatedAt = new Date();
  }

  schedule(scheduledFor: Date): void {
    this.props.status = 'scheduled';
    this.props.scheduledFor = scheduledFor;
    this.props.updatedAt = new Date();
  }
}
