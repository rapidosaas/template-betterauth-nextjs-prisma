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

### 9️⃣ Générer et appliquer les migrations BetterAuth en local  
BetterAuth nécessite des tables spécifiques pour gérer l'authentification.   
Générez le fichier SQL de migration avec la commande suivante :
``` sh
npx @better-auth/cli generate --config src/lib/auth-local.ts --output ./pg/better-auth/migrations.sql
``` 
*(Si la commande échoue, assurez-vous que le dossier `pg` est créé et qu’il contient le dossier `better-auth`. Créez-les manuellement si nécessaire.)* 

Ensuite, appliquez la migration via pgAdmin4 en suivant ces étapes :

- 1️⃣ Ouvrir pgAdmin4 et se connecter à votre base de données locale.
- 2️⃣ Sélectionner votre base de données dans le panneau de navigation.
- 3️⃣ Ouvrir l'éditeur SQL en cliquant sur l'icône "Query Tool" (🔍).
- 4️⃣ Charger le fichier SQL généré :

    - Cliquez sur "File" > "Open File".
    - Sélectionnez ./pg/better-auth/migrations.sql.
- 5️⃣ Exécuter la migration en cliquant sur le bouton "Execute" (▶️).
- 6️⃣ Vérifier que les tables ont bien été créées en exécutant cette requête :
``` sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
``` 
✅ Si tout est correct, vous devriez voir les nouvelles tables de BetterAuth apparaître.

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

### 1️⃣1️⃣ Mise à jour de la base de données en local (PostgreSQL - pgAdmin4)   
Après avoir supprimé manuellement le champ `emailVerified` dans `pg\better-auth\migrations.sql`, il est nécessaire de s'assurer que la base de données PostgreSQL locale est bien synchronisée et reflète les dernières modifications. Pour cela se rendre sur pgAdmin4 et vider la base de données en ouvrant l’éditeur SQL et en cliquant sur "Query Tool".  
```sql DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```
✅ Cela supprime complètement toutes les tables et les recrée avec un schéma vide. 
Re-exécuter la requête de creations des tables à jour en intégrant le contenu a jour du fichier `pg\better-auth\migrations.sql`.
près avoir appliqué la migration, vérifiez que la colonne a bien disparu.  
```sql 
SELECT column_name FROM information_schema.columns WHERE table_name = 'user';
```  
✅ Si emailVerified n’apparaît plus, la suppression a bien été appliquée.


