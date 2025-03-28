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

### 9️⃣ Générer et appliquer les migrations BetterAuth en prod  
BetterAuth nécessite des tables spécifiques pour gérer l'authentification.  
Générez le schéma Prisma avec la commande suivante :  
```sh
npx @better-auth/cli generate --config src/lib/auth-prod.ts --output prisma/schema.prisma
```  
*(Si la commande échoue, assurez-vous que le dossier `prisma` sinon créez-le manuellement si nécessaire.)* 

🛠 Création de la base de données sur Neon.tech via Vercel
Pour utiliser une base de données PostgreSQL en production avec Neon.tech, suivez ces étapes :

- 1️⃣ Accédez à Vercel et ouvrez votre projet.
- 2️⃣ Allez dans l’onglet "Storage", puis cliquez sur "Add a Database".
- 3️⃣ Sélectionnez Neon.tech comme fournisseur.
- 4️⃣ Configurez votre base de données et récupérez l'URL de connexion.
- 5️⃣ Assignez cette URL à la variable **DATABASE_URL** de votre fichier .env.  

🔄 Appliquer la migration vers Neon.tech  
Une fois la base de données prête, appliquez la migration Prisma pour créer les tables BetterAuth : 
```sh
npx prisma migrate deploy
```  
👉 Si vous préférez pousser le schéma sans migrations, utilisez plutôt :
```sh  
npx prisma db push
```  
🚀 Votre base de données est maintenant prête à être utilisée avec Prisma et BetterAuth ! ✅

### 1️⃣0️⃣ Configuration des méthodes d'authentification, du gestionnaire de routes et de l'instance cliente  
- 1️⃣ Configuration des méthodes d'authentification  
Dans votre fichier d’authentification (**auth-local.ts** ou **auth-prod.ts**), , assurez-vous que l’authentification par **email et mot de passe** est bien activée en ajoutant ces paramètres :  
```ts  
emailAndPassword: {
    enabled: true,
    autoSignIn: false,
}
```  
- 2️⃣ Mise en place du gestionnaire de routes   
Le fichier `/src/app/api/auth/[...all]/route.ts` permet d'exposer les routes d'authentification côté API Next.js.  
- 3️⃣ Création de l'instance cliente  
Le fichier `/src/lib/auth-client.ts` gère l'authentification côté client et permet d’interagir avec l’authentification dans les composants React.


### 1️⃣1️⃣ Mise à jour de la base de données en production (Neon.tech)
Après avoir modifié le schema.prisma, il est nécessaire de mettre à jour la base de données Neon.tech pour synchroniser les nouvelles tables et supprimer le champ emailVerified.

- 1️⃣ Réinitialiser la base de données sur Neon.tech  
⚠️ Attention : Cette commande va supprimer toutes les données existantes et recréer la base avec les nouvelles migrations.  
Assurez-vous d’avoir une sauvegarde si nécessaire. Exécutez la commande suivante :  
    ```sh  
    npx prisma migrate reset
    ```  
    ✅ Cela va :
        - Supprimer et recréer la base de données.
        - Appliquer toutes les migrations existantes.
- 2️⃣ Appliquer la nouvelle migration pour supprimer le champs **emailVerified**
    Une fois la base réinitialisée, créez une nouvelle migration avec Prisma :
    ```sh
    npx prisma migrate dev --name remove_emailVerified_field
    ```  
    ✅ Cela va :
        - Générer une nouvelle migration nommée `remove_email_verified_field`.
        - Mettre à jour le schéma de la base de données sur Neon.tech.
- 3️⃣ Vérifier les modifications
    Pour s’assurer que tout a bien été appliqué, exécutez les commandes suivantes :  
    Vérifier l’état des migrations appliquées :  
    ```sh
    npx prisma migrate status
    ```  
    ✅ Cela permet de voir si toutes les migrations sont bien appliquées sur la base de données.  
    Explorer la base de données graphiquement :
    ```sh
    npx prisma studio
    ```  
    ✅ Cela permet de visualiser et vérifier les nouvelles tables et champs.





