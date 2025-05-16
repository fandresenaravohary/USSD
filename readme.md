# USSD MyTel – Simulation de service USSD en TypeScript

Ce projet simule un service USSD interactif dans une interface en ligne de commande. Il permet aux utilisateurs de naviguer dans un menu USSD pour consulter leur solde, recharger un compte, retirer ou transférer de l’argent. Le code est écrit en TypeScript et s’exécute via Node.js.

## Fonctionnalités

- Démarrage de la session avec le code USSD `*123#`
- Menu principal avec options :

  1. Consulter le solde
  2. Recharger un numéro
  3. Retirer de l’argent
  4. Transférer de l’argent
  5. Quitter le service

- Validation des entrées :

  - Numéro de téléphone au format `03XXXXXXXX` ou `04XXXXXXXX`
  - Montants strictement positifs

- Gestion des erreurs (solde insuffisant, format invalide, etc.)
- Navigation « retour » via `*` ou `BACK` et gestion de timeout (`TIMEOUT`)
- Architecture modulaire (services, modèles, utilitaires)

## Conventions de développement

La configuration ESLint utilise `@typescript-eslint` et impose les règles suivantes :

```jsonc
{
  "rules": {
    "@typescript-eslint/naming-convention": [
      "error",
      { "selector": "default", "format": ["camelCase"] },
      { "selector": "variableLike", "format": ["camelCase"] },
      { "selector": "function", "format": ["camelCase"] },
      { "selector": "parameter", "format": ["camelCase"] },
      {
        "selector": "memberLike",
        "modifiers": ["private"],
        "format": ["camelCase"]
      },
      { "selector": "typeLike", "format": ["PascalCase"] }
    ],
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { "argsIgnorePattern": "^_" }
    ],
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

## Installation et exécution

Assurez-vous d’avoir Node.js (v18 ou supérieure) et npm installés, puis suivez ces étapes :

```bash
# Cloner le dépôt
git clone https://github.com/<votre-utilisateur>/mytel-ussd.git
cd mytel-ussd
# Installer les dépendances
npm install
# Compiler le code TypeScript
npm run build
# Lancer l’application
npm start
```

## Exemple de session

```text
Bienvenue sur le service USSD MyTel.
Entrez un code USSD pour démarrer

Code USSD : *123#

Menu Principal MyTel (*123#)
1. Consulter le solde
2. Recharger un numéro
3. Retirer de l'argent
4. Transférer de l'argent
0. Quitter le service
```

## Scripts disponibles

| Commande        | Description                     |
| --------------- | ------------------------------- |
| `npm start`     | Exécute l’application           |
| `npm run build` | Compile les fichiers TypeScript |
| `npm run lint`  | Analyse le code avec ESLint     |

## Licence

Ce projet est réalisé dans le cadre d’un projet pédagogique. Toute réutilisation en production doit mentionner l’auteur.

## Auteur

Fandresena Ravohary
