# Fit Log

Carnet de musculation en français, conçu pour une utilisation sur téléphone ou ordinateur dans une salle comme Basic-Fit. Le catalogue contient 100 exercices et chaque fiche situe les muscles ciblés sur des silhouettes de face et de dos. Les fiches sur machine et à la poulie indiquent le nom de l’appareil et affichent une photo externe, avec un lien vers sa source. La légende distingue les photos prises en club des modèles Matrix Fitness présentés à titre de repère. Le matériel varie selon le club.

## Démarrage

Décompresse le projet et ouvre `index.html` dans un navigateur. Tu peux aussi servir le dossier avec `python -m http.server 8000` et ouvrir `http://localhost:8000`. L’application est statique et peut être hébergée sur GitHub Pages depuis la racine du dépôt.

1. Choisis des exercices dans la bibliothèque ou utilise un modèle dans **Mes séances**.
2. Démarre la séance, saisis les charges et répétitions, puis coche les séries terminées. Le chrono reprend le temps de récupération de l’exercice.
3. Indique ta durée totale, ton poids et l’intensité, puis enregistre la séance.
4. Dans **Progression**, sélectionne un exercice pour consulter sa charge maximale par semaine ou par jour. Les semaines commencent le lundi.

Les séances et brouillons sont conservés dans le navigateur de l’appareil utilisé. Avec les tractions assistées, la charge affichée correspond à l’assistance. Pour les mouvements au poids du corps, indique 0 kg si tu ne portes aucune charge supplémentaire.

## Estimation des calories

L’estimation concerne la séance entière et utilise la formule `MET × 3,5 × poids en kg × durée en min ÷ 200`. Les facteurs de 3,5 (modérée) et 6 (soutenue) viennent du [2024 Adult Compendium of Physical Activities](https://pacompendium.com/adult-compendium/).
