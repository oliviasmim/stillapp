import { StillMoment } from '../entities/still-moment';
import { StillMomentId } from '../value-objects/still-moment-id';

export interface IStillMomentRepository {
  findById(id: StillMomentId): Promise<StillMoment | null>;
  findActive(): Promise<StillMoment[]>;
  findBySourceItem(sourceItemId: string): Promise<StillMoment[]>;
  save(moment: StillMoment): Promise<void>;
  saveMany(moments: StillMoment[]): Promise<void>;
  delete(id: StillMomentId): Promise<void>;
}

export const STILL_MOMENT_REPOSITORY = Symbol('IStillMomentRepository');
