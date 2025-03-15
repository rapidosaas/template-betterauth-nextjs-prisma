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
