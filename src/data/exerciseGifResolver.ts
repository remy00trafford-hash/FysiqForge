export type ExerciseGifAsset = { id: string; name: string; gifUrl: string; score: number };

/**
 * Disabled by design: ExerciseGymGifsDB media licensing is not confirmed for
 * commercial SaaS use. Kept as a compatibility API so older imports do not
 * break, but it never fetches or returns third-party GIFs.
 */
export async function loadExerciseGifDataset(): Promise<never[]> {
  return [];
}

export async function findExerciseGif(_exerciseId?: string, _exerciseName?: string): Promise<ExerciseGifAsset | null> {
  return null;
}
