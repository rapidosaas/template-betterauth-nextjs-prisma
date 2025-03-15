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

### 3️⃣ Configurer la base de données Neon.tech
Récupérez l'URL de connexion PostgreSQL depuis votre tableau de bord Neon.tech.  
Ajoutez-la au fichier .env :  
```env
DATABASE_URL="postgresql://user:password@your-neon-db.neon.tech/dbname?sslmode=require"
``` 
⚠ Neon.tech nécessite l'activation de SSL, donc assurez-vous d’avoir sslmode=require dans l'URL.

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

### 6️⃣ Création du fichier de configuration d’authentification en production  
Ajoutez un fichier src/lib/auth-prod.ts :
```ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
 
const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
});
```
✅ Ce fichier configure BetterAuth pour utiliser Prisma avec Neon.tech.

### 7️⃣ Vérifier la connexion à la base de données
Ajoutez un fichier src/lib/test-auth-prod.ts pour tester la connexion à Neon.tech :
```ts
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function testPrisma() {
    try {
        // Définir un type explicite pour le résultat
        const res = await prisma.$queryRaw<{ now: Date }[]>`SELECT NOW()`;
        
        console.log("✅ Connexion réussie à PostgreSQL (PRISMA) - Date serveur :", res[0].now);
    } catch (error) {
        console.error("❌ Erreur de connexion à PostgreSQL (PRISMA) :", error);
    } finally {
        await prisma.$disconnect();
    }
}

testPrisma();
```  

#### Exécuter le test :
``` sh
npx tsx src/lib/test-auth-prod.ts
``` 
#### Résultat attendu :
``` sql
✅ Connexion réussie à PostgreSQL (PRISMA) - Date serveur : 2025-03-15T15:15:21.936Z
``` 