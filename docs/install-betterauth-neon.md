# Installation de BetterAuth avec Next.js et Neon.tech

## Prérequis
- Node.js installé
- Un compte [Neon.tech](https://neon.tech/) avec une base PostgreSQL créée
- Un projet Next.js existant


## Étapes d'installation

### 1️⃣ Installer les dépendances

Dans votre projet Next.js, exécutez les commandes suivantes pour ajouter les dépendances nécessaires :

```sh
npm install @prisma/client bcryptjs better-auth pg prisma sonner
npm install -D @types/bcryptjs @types/node ts-node typescript
```  

### 2️⃣ Initialiser Prisma
Prisma est l'ORM utilisé pour gérer la base de données PostgreSQL. Pour l'initialiser, exécutez :

```sh
npx prisma init
``` 
Cela va générer un fichier prisma/schema.prisma et un fichier .env à la racine du projet.
