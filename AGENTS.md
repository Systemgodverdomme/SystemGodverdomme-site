# AGENTS.md — SystemGodverdomme-site

## Description courte
Site vitrine statique de **System Godverdomme** (SGVD), avec pages éditoriales, pages morceaux et pages de navigation.

## Structure générale
- Racine: pages principales (`index.html`, `manifeste.html`, `simulation.html`, `dictionnaire.html`, etc.).
- Dossiers par section: `titres/`, `videos/`, `rituels/`.
- Dossiers par morceau: ex. `vnpmb/`, `imdone/`, `Anlevmwendou/`, `Sansunbruit/`.
- SEO / routing: `sitemap.xml`, `robots.txt`, `_redirects`, `_headers`.
- Assets: `assets/` (images, audio, etc.).

## Contraintes techniques
- Site statique **HTML/CSS/JS** uniquement.
- Pas d'usine à gaz.
- Pas d'ajout de framework.
- Pas de refonte globale sans demande explicite.

## Contraintes de modification
- Faire des changements **ciblés** seulement.
- Préserver le style SGVD existant.
- Éviter les renommages risqués (surtout casse de dossiers/fichiers déjà publiés).
- Éviter les modifications larges de navigation.
- Être prudent sur les URLs, redirects, canonical et sitemap.

## Conventions simples
- Privilégier la lisibilité et la maintenabilité.
- Réutiliser les motifs existants avant d'en créer de nouveaux.
- Garder les pages faciles à éditer manuellement.

## Workflow recommandé
1. Analyser d'abord (liens, chemins, impacts SEO/routing).
2. Proposer un plan court.
3. Modifier peu de fichiers, avec portée limitée.
4. Ouvrir une PR claire (quoi, pourquoi, risques évités).

## Review guidelines
- Vérifier les liens internes.
- Vérifier les chemins et la casse.
- Vérifier qu'aucune page existante n'est cassée.
- Vérifier que le changement reste proportionné à la demande.
