import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
dotenv.config()

async function main() {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  })
  try {
    console.log('Attempting to connect to MongoDB...')
    const cycles = await prisma.cycle.findMany()
    console.log('Cycles found:', cycles.length)
  } catch (e) {
    console.error('Connection failed:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
