# Installation de BetterAuth avec Next.js et PostgreSQL locale

## Prérequis
- Node.js installé
- PostgreSQL installé en local
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

### 3️⃣ Configurer la base de données locale
Dans le fichier .env, ajoutez votre connexion à PostgreSQL :
```env  
DATABASE_URL="postgresql://user:password@localhost:5432/your_database"
``` 
Remplacez user, password et your_database par vos propres valeurs.

### 4️⃣ Exécuter la migration Prisma
Si vous utilisez des migrations :
``` sh
npx prisma migrate dev --name init
``` 
Sinon, poussez le schéma vers la base de données sans migrations :
``` sh
npx prisma db push
``` 

### 5️⃣ Démarrer le projet
Enfin, lancez votre projet :
``` sh
npm run dev
``` 

### 6️⃣ Installer les modules supplémentaires
Avant d'aller plus loin, installons pg, dotenv et les types nécessaires.
```sh
npm install pg dotenv
npm install -D @types/pg
```

### 7️⃣ Création du fichier de configuration d’authentification locale
Ajoutez un fichier src/lib/auth-local.ts :
```ts
import { betterAuth } from "better-auth";
import { Pool } from "pg";

import dotenv from "dotenv";

dotenv.config(); // Charger les variables d'environnement

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    }),
});
```
✅ Ce fichier configure BetterAuth pour utiliser PostgreSQL en local.

### 8️⃣ Vérifier la connexion à la base de données
Ajoutez un fichier src/lib/test-auth-local.ts pour tester la connexion :
```ts
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
    try {
        const client = await pool.connect();
        const res = await client.query("SELECT NOW()");
        console.log("✅ Connexion réussie à PostgreSQL (LOCAL) - Date serveur :", res.rows[0].now);
        client.release();
    } catch (error) {
        console.error("❌ Erreur de connexion à PostgreSQL (LOCAL) :", error);
    } finally {
        await pool.end();
    }
}

testConnection();
```  

#### Exécuter le test :
``` sh
npx tsx src/lib/test-auth-local.ts
``` 
#### Résultat attendu :
``` sql
✅ Connexion réussie à PostgreSQL (LOCAL) - Date serveur : 2025-03-15T15:11:54.743Z
``` 