import { Draft } from '../entities/draft';
import { DraftId } from '../value-objects/draft-id';

export interface IDraftRepository {
  findById(id: DraftId): Promise<Draft | null>;
  findAll(): Promise<Draft[]>;
  findAllActive(): Promise<Draft[]>;
  save(draft: Draft): Promise<void>;
  delete(id: DraftId): Promise<void>;
}

export const DRAFT_REPOSITORY = Symbol('IDraftRepository');
