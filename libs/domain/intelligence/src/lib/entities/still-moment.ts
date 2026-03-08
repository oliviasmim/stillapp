import { StillMomentId } from '../value-objects/still-moment-id';
import { SimilarityScore } from '../value-objects/similarity-score';

export interface StillMomentProps {
  id: StillMomentId;
  sourceItemId: string;
  relatedItemId: string;
  score: SimilarityScore;
  surfacedAt: Date | null;
  dismissedAt: Date | null;
  createdAt: Date;
}

export class StillMoment {
  private constructor(private readonly props: StillMomentProps) {}

  static create(
    id: StillMomentId,
    sourceItemId: string,
    relatedItemId: string,
    score: SimilarityScore,
  ): StillMoment {
    return new StillMoment({
      id,
      sourceItemId,
      relatedItemId,
      score,
      surfacedAt: null,
      dismissedAt: null,
      createdAt: new Date(),
    });
  }

  static reconstitute(props: StillMomentProps): StillMoment {
    return new StillMoment(props);
  }

  get id(): StillMomentId { return this.props.id; }
  get sourceItemId(): string { return this.props.sourceItemId; }
  get relatedItemId(): string { return this.props.relatedItemId; }
  get score(): SimilarityScore { return this.props.score; }
  get surfacedAt(): Date | null { return this.props.surfacedAt; }
  get dismissedAt(): Date | null { return this.props.dismissedAt; }
  get createdAt(): Date { return this.props.createdAt; }
  get isActive(): boolean { return this.props.dismissedAt === null; }

  surface(): void {
    this.props.surfacedAt = new Date();
  }

  dismiss(): void {
    this.props.dismissedAt = new Date();
  }
}
