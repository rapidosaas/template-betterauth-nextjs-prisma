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
