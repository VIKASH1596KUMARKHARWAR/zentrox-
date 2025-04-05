export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    // Make sure the code doesn’t crash during build
    if (!req || typeof req.json !== 'function') {
      return new NextResponse('Skipping due to invalid request object', { status: 200 })
    }

    const body = await req.json()
    const { id, email_addresses, first_name, image_url } = body?.data || {}

    const email = email_addresses?.[0]?.email_address

    await db.user.upsert({
      where: { clerkId: id },
      update: {
        email,
        name: first_name,
        profileImage: image_url,
      },
      create: {
        clerkId: id,
        email,
        name: first_name || '',
        profileImage: image_url || '',
      },
    })

    return new NextResponse('User updated successfully', { status: 200 })
  } catch (error) {
    console.error('❌ Clerk webhook error:', error)
    return new NextResponse('Error updating user in database', { status: 500 })
  }
}
