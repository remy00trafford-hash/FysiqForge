// FysiqForge verified exercise media registry.
// Production rule: no approximate movement matching. Every entry must map to an
// exact movement key present in the master exercise library and carry a
// commercially usable, source-documented licence.

export type ExerciseMedia = {
  animationKey: string;
  type: "video";
  url: string;
  source: "Wikimedia Commons" | "Pexels";
  license: string;
  attribution?: string;
  sourcePage: string;
  visualStatus: "verified-exact" | "candidate-review";
};

export const VERIFIED_EXERCISE_MEDIA: Record<string, ExerciseMedia> = {
  barbell_bench_press: { animationKey: "barbell_bench_press", type: "video", url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Bench_press_-_exercise_demonstration_video.webm", source: "Wikimedia Commons", license: "CC BY 3.0", attribution: "FitnessScape", sourcePage: "https://commons.wikimedia.org/wiki/File:Bench_press_-_exercise_demonstration_video.webm", visualStatus: "verified-exact" },
  incline_barbell_bench_press: { animationKey: "incline_barbell_bench_press", type: "video", url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Incline_press_-_exercise_demonstration_video.webm", source: "Wikimedia Commons", license: "CC BY 3.0", attribution: "FitnessScape", sourcePage: "https://commons.wikimedia.org/wiki/File:Incline_press_-_exercise_demonstration_video.webm", visualStatus: "verified-exact" },
  barbell_bent_over_row: { animationKey: "barbell_bent_over_row", type: "video", url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Bent-over_row_-_exercise_demonstration_video.webm", source: "Wikimedia Commons", license: "CC BY 3.0", attribution: "FitnessScape", sourcePage: "https://commons.wikimedia.org/wiki/File:Bent-over_row_-_exercise_demonstration_video.webm", visualStatus: "verified-exact" },
  t_bar_row: { animationKey: "t_bar_row", type: "video", url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/How_to_do_a_T-Bar_Row_in_strength_training_workouts.webm", source: "Wikimedia Commons", license: "CC BY 3.0", attribution: "FitnessScape", sourcePage: "https://commons.wikimedia.org/wiki/File:How_to_do_a_T-Bar_Row_in_strength_training_workouts.webm", visualStatus: "verified-exact" },
  conventional_deadlift: { animationKey: "conventional_deadlift", type: "video", url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Deadlift_-_exercise_demonstration_video.webm", source: "Wikimedia Commons", license: "CC BY 3.0", attribution: "FitnessScape", sourcePage: "https://commons.wikimedia.org/wiki/File:Deadlift_-_exercise_demonstration_video.webm", visualStatus: "verified-exact" },
  standing_barbell_overhead_press: { animationKey: "standing_barbell_overhead_press", type: "video", url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Shoulder_press_-_exercise_demonstration_video.webm", source: "Wikimedia Commons", license: "CC BY 3.0", attribution: "FitnessScape", sourcePage: "https://commons.wikimedia.org/wiki/File:Shoulder_press_-_exercise_demonstration_video.webm", visualStatus: "verified-exact" },
  pull_up: { animationKey: "pull_up", type: "video", url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pull-ups_-_exercise_demonstration_video.webm", source: "Wikimedia Commons", license: "CC BY 3.0", attribution: "FitnessScape", sourcePage: "https://commons.wikimedia.org/wiki/File:Pull-ups_-_exercise_demonstration_video.webm", visualStatus: "verified-exact" },
  machine_chest_press: { animationKey: "machine_chest_press", type: "video", url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Muscle_Strengthening_at_the_Gym_-_Chest_Press.webm", source: "Wikimedia Commons", license: "Public domain (US federal government / CDC)", attribution: "Centers for Disease Control and Prevention", sourcePage: "https://commons.wikimedia.org/wiki/File:Muscle_Strengthening_at_the_Gym_-_Chest_Press.webm", visualStatus: "verified-exact" },
  leg_press: { animationKey: "leg_press", type: "video", url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Muscle_Strengthening_at_the_Gym_-_Seated_Leg_Press.webm", source: "Wikimedia Commons", license: "Public domain (US federal government / CDC)", attribution: "Centers for Disease Control and Prevention", sourcePage: "https://commons.wikimedia.org/wiki/File:Muscle_Strengthening_at_the_Gym_-_Seated_Leg_Press.webm", visualStatus: "verified-exact" },
  leg_extension: { animationKey: "leg_extension", type: "video", url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Muscle_Strengthening_at_the_Gym_-_Leg_Extension.webm", source: "Wikimedia Commons", license: "Public domain (US federal government / CDC)", attribution: "Centers for Disease Control and Prevention", sourcePage: "https://commons.wikimedia.org/wiki/File:Muscle_Strengthening_at_the_Gym_-_Leg_Extension.webm", visualStatus: "verified-exact" },
  leg_curl: { animationKey: "leg_curl", type: "video", url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Muscle_Strengthening_at_the_Gym_-_Leg_Curl.webm", source: "Wikimedia Commons", license: "Public domain (US federal government / CDC)", attribution: "Centers for Disease Control and Prevention", sourcePage: "https://commons.wikimedia.org/wiki/File:Muscle_Strengthening_at_the_Gym_-_Leg_Curl.webm", visualStatus: "verified-exact" },
  burpee: { animationKey: "burpee", type: "video", url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Burpee.webm", source: "Wikimedia Commons", license: "CC BY-SA 4.0", attribution: "Taco Fleur", sourcePage: "https://commons.wikimedia.org/wiki/File:Burpee.webm", visualStatus: "verified-exact" },
  sprawl: { animationKey: "sprawl", type: "video", url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Sprawl_Exercise.webm", source: "Wikimedia Commons", license: "CC BY-SA 4.0", attribution: "Taco Fleur", sourcePage: "https://commons.wikimedia.org/wiki/File:Sprawl_Exercise.webm", visualStatus: "verified-exact" },
  barbell_curl: { animationKey: "barbell_curl", type: "video", url: "https://www.pexels.com/video/37281095/", source: "Pexels", license: "Pexels License — free commercial use", attribution: "Ds babariya", sourcePage: "https://www.pexels.com/video/37281095/", visualStatus: "verified-exact" },
  push_up: { animationKey: "push_up", type: "video", url: "https://www.pexels.com/video/men-doing-push-ups-8480310/", source: "Pexels", license: "Pexels License — free commercial use", attribution: "Yan Krukau", sourcePage: "https://www.pexels.com/video/men-doing-push-ups-8480310/", visualStatus: "verified-exact" },
  forty_five_degree_leg_press: { animationKey: "forty_five_degree_leg_press", type: "video", url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Hip_Sled_-_How_to_perform_a_45_degree_leg_press.webm", source: "Wikimedia Commons", license: "CC BY 3.0", attribution: "FitnessScape", sourcePage: "https://commons.wikimedia.org/wiki/File:Hip_Sled_-_How_to_perform_a_45_degree_leg_press.webm", visualStatus: "verified-exact" },
  forward_lunge: { animationKey: "forward_lunge", type: "video", url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Forward_lunge_training.webm", source: "Wikimedia Commons", license: "CC BY-SA 4.0", attribution: "Skhulile Mthiyane", sourcePage: "https://commons.wikimedia.org/wiki/File:Forward_lunge_training.webm", visualStatus: "verified-exact" },
};

export const VERIFIED_MEDIA_KEYS = Object.keys(VERIFIED_EXERCISE_MEDIA);

export const getVerifiedExerciseMedia = (animationKey: string) => VERIFIED_EXERCISE_MEDIA[animationKey] ?? null;
