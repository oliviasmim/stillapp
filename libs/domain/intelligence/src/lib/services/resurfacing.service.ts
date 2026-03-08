import { StillMoment } from '../entities/still-moment';
import { StillMomentId } from '../value-objects/still-moment-id';
import { SimilarityScore } from '../value-objects/similarity-score';

export interface EmbeddedItem {
  id: string;
  embedding: number[];
}

export interface ResurfacingPort {
  computeSimilarity(a: number[], b: number[]): number;
}

export class ResurfacingService {
  constructor(private readonly port: ResurfacingPort) {}

  computeMoments(items: EmbeddedItem[], minScore = 0.70): StillMoment[] {
    const moments: StillMoment[] = [];
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const raw = this.port.computeSimilarity(items[i].embedding, items[j].embedding);
        if (raw >= minScore) {
          moments.push(
            StillMoment.create(
              StillMomentId.generate(),
              items[i].id,
              items[j].id,
              SimilarityScore.of(raw),
            ),
          );
        }
      }
    }
    return moments.sort((a, b) => b.score.compareTo(a.score));
  }
}
