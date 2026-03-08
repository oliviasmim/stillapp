import { LibraryItem, LibraryItemKind } from '../entities/library-item';
import { LibraryItemId } from '../value-objects/library-item-id';

export interface ILibraryRepository {
  findById(id: LibraryItemId): Promise<LibraryItem | null>;
  findAll(): Promise<LibraryItem[]>;
  findByKind(kind: LibraryItemKind): Promise<LibraryItem[]>;
  findByTag(tag: string): Promise<LibraryItem[]>;
  findWithoutEmbedding(): Promise<LibraryItem[]>;
  save(item: LibraryItem): Promise<void>;
  delete(id: LibraryItemId): Promise<void>;
}

export const LIBRARY_REPOSITORY = Symbol('ILibraryRepository');
