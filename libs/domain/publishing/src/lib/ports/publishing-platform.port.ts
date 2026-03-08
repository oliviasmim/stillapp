import { Post } from '../entities/post';

export interface PublishResult {
  platformPostId: string;
  url: string;
}

export interface IPublishingPlatformPort {
  publish(post: Post): Promise<PublishResult>;
}

export const PUBLISHING_PLATFORM_PORT = Symbol('IPublishingPlatformPort');
