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
