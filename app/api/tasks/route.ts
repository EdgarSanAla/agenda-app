import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/tasks?date=YYYY-MM-DD
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const dateParam = searchParams.get('date')

  let where: any = {}
  if (dateParam) {
    const start = new Date(dateParam + 'T00:00:00.000Z')
    const end = new Date(start)
    end.setUTCDate(end.getUTCDate() + 1)
    where.date = { gte: start, lt: end }
  }

  const tasks = await prisma.task.findMany({ where, orderBy: { createdAt: 'asc' } })
  return NextResponse.json(tasks)
}

// POST /api/tasks
export async function POST(req: Request) {
  const body = await req.json()
  const { title, date } = body
  if (!title || !date) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
  }

  const task = await prisma.task.create({
    data: { title, date: new Date(date + 'T00:00:00.000Z') },
  })
  return NextResponse.json(task)
}
