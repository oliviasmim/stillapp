import { Post, PostStatus, PublishingPlatform } from '../entities/post';
import { PostId } from '../value-objects/post-id';

export interface IPostRepository {
  findById(id: PostId): Promise<Post | null>;
  findByDraft(draftId: string): Promise<Post[]>;
  findByStatus(status: PostStatus): Promise<Post[]>;
  findByPlatform(platform: PublishingPlatform): Promise<Post[]>;
  save(post: Post): Promise<void>;
  delete(id: PostId): Promise<void>;
}

export const POST_REPOSITORY = Symbol('IPostRepository');
