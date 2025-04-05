export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Prevent build crash
  if (process.env.NODE_ENV === 'production' && !req?.headers) {
    return new NextResponse('Skipping during build', { status: 200 });
  }

  try {
    const body = await req.json();
    const { id, email_addresses, first_name, image_url } = body?.data ?? {};
    const email = email_addresses?.[0]?.email_address;

    console.log('✅ Clerk Webhook Payload:', body);

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
    });

    return new NextResponse('User updated', { status: 200 });
  } catch (error) {
    console.error('❌ Error:', error);
    return new NextResponse('Error', { status: 500 });
  }
}
