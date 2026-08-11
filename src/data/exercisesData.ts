import { ExerciseItem, MusicPlaylist } from "../types";

export const EXERCISE_DATABASE: Record<string, ExerciseItem> = {
  // --- PECTORAUX (CHEST) ---
  bench_press: {
    id: "bench_press",
    name: "Développé Couché à la Barre",
    muscleGroup: "Pectoraux (Moyen & Supérieur)",
    sets: 4,
    reps: "8 - 10 reps",
    restSeconds: 90,
    tips: "Garde les omoplates rétractées et le dos légèrement arqué. Descends la barre sous les tétons.",
    illustrationUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    executionSteps: [
      "Allonge-toi sur le banc, pieds à plat au sol, omoplates serrées.",
      "Saisis la barre à une largeur légèrement supérieure aux épaules.",
      "Inspire en descendant la barre de manière contrôlée vers le bas de la poitrine.",
      "Pousse de façon explosive en expirant, sans verrouiller brutalement les coudes."
    ],
    alternativeExercise: "Développé couché aux haltères"
  },
  incline_dumbbell: {
    id: "incline_dumbbell",
    name: "Développé Incliné aux Haltères",
    muscleGroup: "Pectoraux Supérieurs & Deltoïde Antérieur",
    sets: 4,
    reps: "10 - 12 reps",
    restSeconds: 75,
    tips: "Banc incliné entre 30° et 45°. Garde une trajectoire légèrement convergente vers le haut.",
    illustrationUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
    executionSteps: [
      "Règle le banc à 30-45 degrés.",
      "Remonte les haltères à hauteur d'épaules avec tes genoux.",
      "Pousse les haltères vers le haut en contractant la partie supérieure de la poitrine.",
      "Contrôle la descente sur 2-3 secondes."
    ],
    alternativeExercise: "Pompes pieds surélevés"
  },
  cable_crossover: {
    id: "cable_crossover",
    name: "Écarté Vis-à-Vis à la Poulie Haute",
    muscleGroup: "Pectoraux Inférieurs & Sillon Central",
    sets: 3,
    reps: "12 - 15 reps",
    restSeconds: 60,
    tips: "Garde un buste légèrement penché vers l'avant et croise légèrement les mains au bas du mouvement.",
    illustrationUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    executionSteps: [
      "Place les poulies en position haute.",
      "Avance d'un pas pour mettre les câbles sous tension.",
      "Amène les poignées vers le bas et le centre en arc de cercle.",
      "Contracte fortement le bas des pectoraux 1 seconde."
    ],
    alternativeExercise: "Dips au poids du corps"
  },
  dips_chest: {
    id: "dips_chest",
    name: "Dips aux Barres Parallèles (Focus Pecs)",
    muscleGroup: "Pectoraux Inférieurs & Triceps",
    sets: 4,
    reps: "8 - 12 reps",
    restSeconds: 90,
    tips: "Penche le buste vers l'avant à 30° et écarte légèrement les coudes pour cibler les pectoraux.",
    illustrationUrl: "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?auto=format&fit=crop&w=800&q=80",
    executionSteps: [
      "Attrape les barres, bras tendus, corps suspendu.",
      "Incline le buste vers l'avant et fléchis les genoux.",
      "Descends jusqu'à avoir les bras parallèles au sol.",
      "Pousse avec la poitrine pour revenir en position initiale."
    ],
    alternativeExercise: "Pompes déclinées"
  },

  // --- DOS (BACK) ---
  lat_pulldown: {
    id: "lat_pulldown",
    name: "Tirage Vertical à la Poulie (Lat Pulldown)",
    muscleGroup: "Grand Dorsal & Grand Rond",
    sets: 4,
    reps: "10 - 12 reps",
    restSeconds: 75,
    tips: "Tire la barre vers la clavicule en ouvrant la cage thoracique. Ne triche pas avec le buste.",
    illustrationUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=800&q=80",
    executionSteps: [
      "Attrape la barre en prise large pronation.",
      "Sieds-toi en calant bien les cuisses sous les manchons.",
      "Initie le mouvement en abaissant les omoplates, puis amène la barre sous le menton.",
      "Relâche doucement pour ressentir l'étirement du grand dorsal."
    ],
    alternativeExercise: "Tractions en pronation"
  },
  bent_over_row: {
    id: "bent_over_row",
    name: "Tirage Buste Penché à la Barre (Barbell Row)",
    muscleGroup: "Épaisseur du Dos & Rhomboïdes",
    sets: 4,
    reps: "8 - 10 reps",
    restSeconds: 90,
    tips: "Buste penché à 45°, dos parfaitement droit, genoux légèrement déverrouillés.",
    illustrationUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    executionSteps: [
      "Saisis la barre en pronation, largeur des épaules.",
      "Penche le buste vers l'avant en gardant le bas du dos neutre.",
      "Tire la barre vers le bas du ventre en amenant les coudes vers l'arrière.",
      "Marque un temps d'arrêt d'une seconde en contraction maximale."
    ],
    alternativeExercise: "Rowing à un bras avec haltère"
  },
  seated_cable_row: {
    id: "seated_cable_row",
    name: "Rowing Assis à la Poulie Basse (Prise Neutre)",
    muscleGroup: "Moyenne Partie du Dos & Trapèzes",
    sets: 4,
    reps: "10 - 12 reps",
    restSeconds: 75,
    tips: "Garde le buste droit et sort la poitrine en tirant la poignée vers le nombril.",
    illustrationUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
    executionSteps: [
      "Assieds-toi face à la poulie, pieds calés sur les repose-pieds.",
      "Saisis la poignée double V, gène les abdos.",
      "Tire la poignée vers l'abdomen en resserrant les omoplates.",
      "Laisse revenir les bras sans arrondir le bas du dos."
    ],
    alternativeExercise: "Rowing T-Bar"
  },
  pullups_bodyweight: {
    id: "pullups_bodyweight",
    name: "Tractions Strictes en Pronation",
    muscleGroup: "Largeur du Dos & Biceps",
    sets: 4,
    reps: "6 - 10 reps",
    restSeconds: 90,
    tips: "Ne balance pas les jambes. Tire avec les coudes jusqu'à passer le menton au-dessus de la barre.",
    illustrationUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80",
    executionSteps: [
      "Suspendu à la barre en prise pronation plus large que les épaules.",
      "Amène la poitrine vers la barre en rétractant les omoplates.",
      "Marque 1 seconde en haut.",
      "Descends de manière totalement contrôlée jusqu'à extension quasi-complète."
    ],
    alternativeExercise: "Tirage vertical à la poulie"
  },

  // --- ÉPAULES (SHOULDERS) ---
  overhead_press: {
    id: "overhead_press",
    name: "Développé Militaire à la Barre (Overhead Press)",
    muscleGroup: "Deltoïdes (Antérieur & Latéral)",
    sets: 4,
    reps: "8 - 10 reps",
    restSeconds: 90,
    tips: "Gaine les fessiers et les abdos pour éviter d'hyper-cambrer le bas du dos.",
    illustrationUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80",
    executionSteps: [
      "Debout, barre posée sur le haut de la poitrine, mains sous les épaules.",
      "Gaine fortement les abdominaux et fessiers.",
      "Pousse la barre à la verticale jusqu'à extension complète des bras.",
      "Redescends la barre avec contrôle au niveau des clavicules."
    ],
    alternativeExercise: "Développé épaules aux haltères assis"
  },
  lateral_raises: {
    id: "lateral_raises",
    name: "Élévations Latérales aux Haltères",
    muscleGroup: "Deltoïde Latéral (Largeur d'épaules)",
    sets: 4,
    reps: "12 - 15 reps",
    restSeconds: 60,
    tips: "Monte les coudes en premier, pas les poignets. Imagine verser de l'eau avec des pichets.",
    illustrationUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80",
    executionSteps: [
      "Debout, un haltère dans chaque main le long du corps.",
      "Élève les bras sur les côtés jusqu'à la hauteur des épaules.",
      "Contrôle la descente sans balancer le buste."
    ],
    alternativeExercise: "Élévations latérales à la poulie haute"
  },
  face_pulls: {
    id: "face_pulls",
    name: "Face Pulls à la Corde (Santé d'Épaule & Arrière)",
    muscleGroup: "Deltoïde Postérieur, Coiffe des Rotateurs & Trapèzes",
    sets: 4,
    reps: "15 reps",
    restSeconds: 60,
    tips: "Tire la corde vers le front en écartant les poignets et en tournant les pouces vers l'arrière.",
    illustrationUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    executionSteps: [
      "Fixe la corde à hauteur de visage sur la poulie haute.",
      "Prends la corde en prise neutre, recule de deux pas.",
      "Tire vers le visage en écartant les coudes et en rétractant les omoplates.",
      "Contracte l'arrière de l'épaule pendant 1 seconde."
    ],
    alternativeExercise: "Oiseau aux haltères buste penché"
  },

  // --- CUISSES & FESSIERS (LEGS) ---
  squat_barbell: {
    id: "squat_barbell",
    name: "Squat Arrière à la Barre (Back Squat)",
    muscleGroup: "Quadriceps, Fessiers & Ischios",
    sets: 4,
    reps: "8 - 10 reps",
    restSeconds: 120,
    tips: "Garde les talons ancrés au sol et le buste fier. Descends les cuisses au moins parallèles au sol.",
    illustrationUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80",
    executionSteps: [
      "Place la barre sur la partie charnue des trapèzes.",
      "Incline légèrement le bassin et inspire pour verrouiller la sangle abdominale.",
      "Descends en poussant les genoux vers l'extérieur et le bassin vers l'arrière.",
      "Pousse sur toute la plante des pieds pour remonter."
    ],
    alternativeExercise: "Presse à cuisses inclinée"
  },
  leg_press: {
    id: "leg_press",
    name: "Presse à Cuisses Inclinée à 45°",
    muscleGroup: "Quadriceps & Fessiers",
    sets: 4,
    reps: "10 - 12 reps",
    restSeconds: 90,
    tips: "Pieds écartés largeur de shoulders au milieu du plateau. Ne verrouille pas violemment les genoux en haut.",
    illustrationUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    executionSteps: [
      "Plaque le bas du dos contre le dossier.",
      "Déverrouille la sécurité et descends le plateau vers le buste.",
      "Inspire en descendant jusqu'à un angle de 90° aux genoux.",
      "Pousse fort sur les talons pour pousser le plateau."
    ],
    alternativeExercise: "Goblet Squat aux haltères"
  },
  romanian_deadlift: {
    id: "romanian_deadlift",
    name: "Soulevé de Terre Romain à la Barre / Haltères",
    muscleGroup: "Ischio-Jambiers & Fessiers",
    sets: 4,
    reps: "10 - 12 reps",
    restSeconds: 90,
    tips: "Flexion minimale des genoux. Pousse le bassin en arrière comme pour fermer une porte avec les fesses.",
    illustrationUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    executionSteps: [
      "Debout, barre ou haltères devant les cuisses.",
      "Pousse les fesses vers l'arrière en glissant les charges le long des jambes.",
      "Ressens l'étirement intense derrière les cuisses sous les genoux.",
      "Contracte les fessiers pour ramener le bassin vers l'avant."
    ],
    alternativeExercise: "Leg Curl allongé"
  },
  bulgarian_split_squat: {
    id: "bulgarian_split_squat",
    name: "Squat Bulgare aux Haltères",
    muscleGroup: "Fessiers & Quadriceps (Unilatéral)",
    sets: 3,
    reps: "10 - 12 reps / jambe",
    restSeconds: 75,
    tips: "Pied arrière posé sur un banc. Descends le genou arrière vers le sol de manière verticale.",
    illustrationUrl: "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80",
    executionSteps: [
      "Pose le dessus du pied arrière sur le banc.",
      "Avance la jambe avant pour avoir un bon appui.",
      "Descends le buste droit jusqu'à frôler le sol avec le genou arrière.",
      "Pousse sur le talon de la jambe avant pour remonter."
    ],
    alternativeExercise: "Fentes marchées aux haltères"
  },

  // --- BRAS & TRICEPS / BICEPS (ARMS) ---
  barbell_curl: {
    id: "barbell_curl",
    name: "Curl Biceps à la Barre EZ",
    muscleGroup: "Biceps Brachial (Masse de bras)",
    sets: 4,
    reps: "10 - 12 reps",
    restSeconds: 60,
    tips: "Coudes collés aux flancs. Ne te balance pas d'avant en arrière.",
    illustrationUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80",
    executionSteps: [
      "Saisis la barre EZ en supination sur les vagues.",
      "Gardes les coudes immobiles sur les côtés.",
      "Monte la barre vers les épaules en contractant fort les biceps.",
      "Contrôle la descente sur 2 secondes."
    ],
    alternativeExercise: "Curl Biceps aux haltères"
  },
  hammer_curl: {
    id: "hammer_curl",
    name: "Curl Marteau aux Haltères",
    muscleGroup: "Brachial Antérieur & Avant-bras",
    sets: 3,
    reps: "12 reps",
    restSeconds: 60,
    tips: "Prise neutre (pouces vers le haut). Développe l'épaisseur du bras vue de face.",
    illustrationUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
    executionSteps: [
      "Un haltère dans chaque main en prise neutre.",
      "Monte alternativement ou en simultané les haltères.",
      "Contracte au sommet sans décoller les coudes du buste.",
      "Redescends lentement."
    ],
    alternativeExercise: "Curl à la corde à la poulie basse"
  },
  triceps_pushdown: {
    id: "triceps_pushdown",
    name: "Extension Triceps à la Corde (Poulie Haute)",
    muscleGroup: "Triceps (Chef Latéral & Médial)",
    sets: 4,
    reps: "12 - 15 reps",
    restSeconds: 60,
    tips: "Écarte les extrémités de la corde en bas du mouvement pour verrouiller la contraction.",
    illustrationUrl: "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?auto=format&fit=crop&w=800&q=80",
    executionSteps: [
      "Attrape la corde sur la poulie haute, coudes fléchis à 90°.",
      "Pousse la corde vers le bas jusqu'à tendre complètement les bras.",
      "Écarte les mains sur les côtés en bas de course.",
      "Reviens doucement en contrôlant sans bouger les coudes."
    ],
    alternativeExercise: "Barre au front allongée"
  },

  // --- SANGLE ABDOMINALE & CORE (ABS) ---
  plank_abs: {
    id: "plank_abs",
    name: "Gainage Ventral Gainé (Planche ISO)",
    muscleGroup: "Transverse & Sangle Abdominale Profonde",
    sets: 4,
    reps: "45 - 60 secondes",
    restSeconds: 45,
    tips: "Rentre le nombril et contracte les fessiers. Ne laisse pas tomber le bassin vers le sol.",
    illustrationUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    executionSteps: [
      "En appui sur les avant-bras et la pointe des pieds.",
      "Alignement parfait tête, épaules, bassin, talons.",
      "Respiration constante et contrôlée.",
      "Maintiens la position avec contraction maximale du transverse."
    ],
    alternativeExercise: "Wheel Rollout / Roulette abdominale"
  },
  hanging_leg_raise: {
    id: "hanging_leg_raise",
    name: "Relevé de Jambes Suspendu à la Barre",
    muscleGroup: "Grand Droit (Partie Inférieure) & Flexeurs",
    sets: 4,
    reps: "12 - 15 reps",
    restSeconds: 60,
    tips: "Enroule le bassin vers la poitrine en haut, ne fais pas qu'élever les jambes avec l'élan.",
    illustrationUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80",
    executionSteps: [
      "Suspendu à la barre fixe, corps immobile.",
      "Remonte les genoux ou les jambes tendues vers le torse.",
      "Enroule légèrement le bas du dos en haut.",
      "Redescends sans balancer le corps."
    ],
    alternativeExercise: "Crunchs au sol pieds relevés"
  }
};

// HIGH ENERGY GYM WORKOUT PLAYLISTS (Official YouTube IFrame Player Mixes)
// IMPORTANT: Tous les youtubeVideoId ci-dessous ont été vérifiés manuellement via
// recherche web (août 2026) — ce sont de vraies vidéos publiques existantes,
// pas des identifiants générés/inventés par l'IA.
export const MUSIC_PLAYLISTS: Record<string, MusicPlaylist> = {
  "Afrobeats Gym Power": {
    genre: "Afrobeats Gym Power",
    title: "Afrobeats Gym Motivation",
    artistOrMix: "The Ultimate Afrobeats Workout Playlist",
    coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    spotifyOrYoutubeUrl: "https://www.youtube.com/watch?v=YnF1nE9FOcs",
    youtubeVideoId: "YnF1nE9FOcs",
    tracks: [
      {
        title: "The Ultimate Afrobeats Workout Playlist",
        duration: "60:00",
        bpm: 128,
        youtubeVideoId: "YnF1nE9FOcs"
      },
      {
        title: "Ultimate Fitness Gym Song - Afrobeat Workout Motivation",
        duration: "45:00",
        bpm: 130,
        youtubeVideoId: "NZNPNuD_-4k"
      },
      {
        title: "Afrobeat Workout Mix - High-Tempo Afrobeat for Exercise",
        duration: "40:00",
        bpm: 132,
        youtubeVideoId: "Gno9Wvi6bIY"
      },
      {
        title: "AFROBEATS MIX 2026 - Amapiano x Afrobeat Club Fusion",
        duration: "50:00",
        bpm: 126,
        youtubeVideoId: "P_v7NwccAcE"
      },
      {
        title: "Ultimate Afrobeats & Amapiano Mix 2026",
        duration: "55:00",
        bpm: 129,
        youtubeVideoId: "vDEZZRaRfqo"
      }
    ]
  },
  "Gym Phonk & Hardstyle": {
    genre: "Gym Phonk & Hardstyle",
    title: "Aggressive Gym Phonk & Hardstyle",
    artistOrMix: "45 Min Gym Phonk Mix - Gym Bass Mode",
    coverUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    spotifyOrYoutubeUrl: "https://www.youtube.com/watch?v=VrgXu81jGvo",
    youtubeVideoId: "VrgXu81jGvo",
    tracks: [
      {
        title: "45 Min Gym Phonk Mix - Gym Bass Mode #4",
        duration: "45:00",
        bpm: 150,
        youtubeVideoId: "VrgXu81jGvo"
      },
      {
        title: "Gym Phonk - Winter Arc Mix - Aggressive Workout Phonk",
        duration: "40:00",
        bpm: 148,
        youtubeVideoId: "kSgTGuCaXgg"
      },
      {
        title: "Demon Phonk - Brutal Gym Phonk - Workout Anthem Mix",
        duration: "42:00",
        bpm: 152,
        youtubeVideoId: "ezih7odzumg"
      },
      {
        title: "Adrenaline Phonk Mix 2026 - Hardcore Workout Music",
        duration: "45:00",
        bpm: 150,
        youtubeVideoId: "KwYuNSwW5k8"
      },
      {
        title: "The Best Gym Phonk 2026 - Aggressive Playlist",
        duration: "50:00",
        bpm: 149,
        youtubeVideoId: "RgWINzIe9HA"
      }
    ]
  },
  "Hip-Hop Trap Workout": {
    genre: "Hip-Hop Trap Workout",
    title: "Trap & Rap Gym Workout Mix",
    artistOrMix: "Trap & Rap Gym Workout Music Mix",
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    spotifyOrYoutubeUrl: "https://www.youtube.com/watch?v=UEZEn4GkFUs",
    youtubeVideoId: "UEZEn4GkFUs",
    tracks: [
      {
        title: "Trap & Rap Gym Workout Music Mix",
        duration: "40:00",
        bpm: 140,
        youtubeVideoId: "UEZEn4GkFUs"
      },
      {
        title: "Best Gym Trap Music Mix - Workout Motivation Music",
        duration: "60:00",
        bpm: 142,
        youtubeVideoId: "iExEY5tRfpo"
      },
      {
        title: "Trap Workout Music Mix - Fitness & Gym Motivation",
        duration: "45:00",
        bpm: 145,
        youtubeVideoId: "F8sTqtJzNY4"
      },
      {
        title: "Aggressive Gym Motivation - Trap Workout Mix 2026",
        duration: "40:00",
        bpm: 143,
        youtubeVideoId: "8PX-GSdvSE0"
      },
      {
        title: "Best Gym Workout Music Mix 2026 - Trap Workout Music",
        duration: "50:00",
        bpm: 141,
        youtubeVideoId: "OwM2hoxCc6g"
      }
    ]
  },
  "Synthwave Pump": {
    genre: "Synthwave Pump",
    title: "Synthwave Gym Overdrive",
    artistOrMix: "Synthwave Workout Mix - 80's Vibe Retrowave",
    coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80",
    spotifyOrYoutubeUrl: "https://www.youtube.com/watch?v=VdXpdliMIXc",
    youtubeVideoId: "VdXpdliMIXc",
    tracks: [
      {
        title: "Synthwave Workout Mix - 80's Vibe Retrowave",
        duration: "35:00",
        bpm: 128,
        youtubeVideoId: "VdXpdliMIXc"
      },
      {
        title: "Synthwave Workout Mix - 80s Vibe Retrowave (Vol.2)",
        duration: "38:00",
        bpm: 130,
        youtubeVideoId: "_N5Hm8G1ggs"
      },
      {
        title: "Gym Music 80's Synth Workout Mix - Retro Wave Cyberpunk",
        duration: "45:00",
        bpm: 132,
        youtubeVideoId: "6G97xIFJ3-A"
      },
      {
        title: "Synthwave Workout Hyper Mix (Retro Game OST Energy)",
        duration: "60:00",
        bpm: 130,
        youtubeVideoId: "hcJ9OKKWSG4"
      }
    ]
  },
  "Metal / Rock Heavy": {
    genre: "Metal / Rock Heavy",
    title: "Hard Rock & Metal Gym Power",
    artistOrMix: "Epic Rock - Gym Motivation Music - Metal Workout Mix",
    coverUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=800&q=80",
    spotifyOrYoutubeUrl: "https://www.youtube.com/watch?v=GQ6zAl8n4_4",
    youtubeVideoId: "GQ6zAl8n4_4",
    tracks: [
      {
        title: "Epic Rock - Gym Motivation Music - Metal Workout Mix",
        duration: "50:00",
        bpm: 150,
        youtubeVideoId: "GQ6zAl8n4_4"
      },
      {
        title: "The Best Hard Rock Metal Gym Workout Music Mix",
        duration: "55:00",
        bpm: 148,
        youtubeVideoId: "Pd5bZXOHhXY"
      },
      {
        title: "Best Rock Workout Music - Hard Rock/Metal Gym Mix",
        duration: "45:00",
        bpm: 152,
        youtubeVideoId: "IrR_R7KoLZk"
      }
    ]
  },
  "Electro EDM Focus": {
    genre: "Electro EDM Focus",
    title: "EDM Gym Energy Boost",
    artistOrMix: "Workout EDM Mix - Energy Boost Gym Music Motivation",
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
    spotifyOrYoutubeUrl: "https://www.youtube.com/watch?v=m3ummgb9lZc",
    youtubeVideoId: "m3ummgb9lZc",
    tracks: [
      {
        title: "Workout EDM Mix - Energy Boost Gym Music Motivation",
        duration: "45:00",
        bpm: 130,
        youtubeVideoId: "m3ummgb9lZc"
      },
      {
        title: "Workout Music Mix - Best Gym Music - Gym EDM Music",
        duration: "40:00",
        bpm: 132,
        youtubeVideoId: "um4yCFFFymE"
      },
      {
        title: "EDM Workout Mix Mashup - Popular EDM Mixes for Gym",
        duration: "50:00",
        bpm: 134,
        youtubeVideoId: "aJAprDMqYyA"
      },
      {
        title: "EDM Gym Mix 2026 - Intense Workout for Strength & HIIT",
        duration: "50:00",
        bpm: 131,
        youtubeVideoId: "wPKzF9ZsLpI"
      },
      {
        title: "Workout Mix 2026 - EDM & Techno Motivation Music",
        duration: "45:00",
        bpm: 133,
        youtubeVideoId: "mlXlMcn2Yi0"
      }
    ]
  }
};

export const DEMO_SAMPLE_PHOTOS = [
  {
    id: "sample_1",
    title: "Profil Athlétique Homme",
    targetZone: "Pectoraux / Sangle Abdominale",
    description: "Analyse morphologique pour prise de masse sèche.",
    label: "Profil Athlétique Homme (Face)",
    url: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sample_2",
    title: "Profil Athlétique Femme",
    targetZone: "Fessiers / Ischios / Galbe",
    description: "Analyse tonification & recomposition corporelle.",
    label: "Profil Athlétique Femme (Face)",
    url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sample_3",
    title: "Posturale & Musculation",
    targetZone: "Épaules / V-Taper / Dos",
    description: "Correction de posture et développement du V-Shape.",
    label: "Posturale / Musculation (Buste)",
    url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80"
  }
];


