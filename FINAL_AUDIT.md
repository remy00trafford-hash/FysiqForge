# FysiqForge – final audit before deployment

## Correctifs finalisés
- Lot 1/2/2.1: classification/mapping corrigés.
- Lot 3: 54 identités d'animation dédiées, 54 spécifications, 54 render cases.
- Les exercices locaux (catalogue principal + fallback) disposent d'illustrations et d'une identité d'animation résoluble.
- Les exercices non résolubles par animation ne sont plus retenus comme base prioritaire dans la normalisation des plans.
- Une correspondance photo faible ne remplace plus silencieusement la photo d'origine d'un exercice.
- Volume cible: 20 exercices minimum par séance.
- Variation entre semaines: identité globale suivie sur le planning 8 semaines, avec variantes explicites seulement en réserve.
- Traduction des noms/étapes: système i18n existant utilisé; correction d'une faute de frappe dans la traduction FR.

## Vérifications exécutées
- Transpilation TypeScript/TSX de tous les fichiers source: 0 diagnostic.
- 54/54 IDs d'animation ont une spécification.
- 54/54 spécifications ont un renderer `case` correspondant.
- 0 `kind` du renderer sans spécification.
- Les 32 exercices du générateur local supplémentaire ont tous une illustration dans leur définition.

## Limite connue
Le build production `npm run build` n'a pas pu être exécuté dans cet environnement car l'installation des dépendances npm a expiré à deux reprises. Le code a été transpile sans diagnostic, mais le bundle Vite/Node final doit être validé dans l'environnement de déploiement avec `npm install` puis `npm run build`.
