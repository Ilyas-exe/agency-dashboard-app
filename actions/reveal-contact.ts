'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function revealContact(contactId: string) {
  const { userId } = await auth()

  if (!userId) {
    return { error: 'Unauthorized' }
  }

  // 1. Get or create usage record for today
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let usage = await prisma.userUsage.findUnique({
    where: { userId },
  })

  // If no usage record exists, create one
  if (!usage) {
    usage = await prisma.userUsage.create({
      data: {
        userId,
        count: 0,
        lastViewedAt: new Date(),
      },
    })
  }

  // Check if we need to reset the count (if last viewed was before today)
  const lastViewed = new Date(usage.lastViewedAt)
  lastViewed.setHours(0, 0, 0, 0)

  if (lastViewed.getTime() < today.getTime()) {
    // Reset count for a new day
    usage = await prisma.userUsage.update({
      where: { userId },
      data: {
        count: 0,
        lastViewedAt: new Date(),
      },
    })
  }

  // 2. Check limit
  if (usage.count >= 50) {
    return { error: 'Daily limit reached', limitReached: true }
  }

  // 3. Increment count
  await prisma.userUsage.update({
    where: { userId },
    data: {
      count: { increment: 1 },
      lastViewedAt: new Date(),
    },
  })

  // 4. Fetch contact details
  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
    select: { email: true, phone: true },
  })

  if (!contact) {
    return { error: 'Contact not found' }
  }

  return { 
    success: true, 
    data: { email: contact.email, phone: contact.phone } 
  }
}
