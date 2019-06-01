(https://www.youtube.com/watch?v=4anAwXYqLG8)
(https://www.sandimetz.com/blog/2016/1/20/the-wrong-abstraction)
(https://www.youtube.com/watch?v=8bZh5LMaSmE)

### TL;DR

L'éducation des devs met trop l'accent sur "DRY", ils cherchent souvent à créer des abstractions innutiles.

Le coût d'une mauvais abstraction est beaucoup plus important que le coût de la duplication.

Ex:
- dev1 enforce une abstraction
- dev2 se retrouve dans un cas quasi similaire, essaye de l'utiliser
- pas adapté, modifie l'abstraction pour faire rentrer son cas
- le temps passe
- l'abstraction devient un fourre-tout vague qui représent un ramassi d'idées à peu près similaires

Pour s'en débarasser, inline partout, simplifier localement partout.


