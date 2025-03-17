import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid"; // ✅ Importer uuid pour générer un id unique

const prisma = new PrismaClient();

console.log(Object.keys(prisma));

async function main() {
  const hashedPassword = bcrypt.hashSync("password123", 10);

  // 🔹 Vérifier si l'utilisateur existe déjà
  let user = await prisma.user.findUnique({
    where: { email: "test@example.com" },
  });

  let userCreated = false;
  let accountCreated = false;

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: "test@example.com",
        name: "Utilisateur Test"
      },
    });
    userCreated = true;
  } else {
    console.log(`Utilisateur existe déjà avec l'email: ${user.email}`);
  }

  // 🔹 Vérifier si un compte existe déjà pour cet utilisateur
  const accountExists = await prisma.account.findFirst({
    where: { userId: user.id, providerId: "credential" },
  });
  
  if (!accountExists) {
    await prisma.account.create({
      data: {
        id: uuidv4(), // ✅ Génération d'un id unique
        userId: user.id,
        accountId: uuidv4(), // Génération d'un accountId unique
        providerId: "credential",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    accountCreated = true;
  } else {
    console.log("Compte existant pour cet utilisateur");
  }

  if (userCreated && accountCreated) {
    console.log("✅ Utilisateur et compte de test créés :", user);
  } else {
    console.log("Échec de la création : utilisateur et/ou compte existent déjà");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });