export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // ✅ Skip processing in production build (to avoid build-time crashes)
    if (process.env.NODE_ENV === 'production') {
      return new NextResponse('Skip in prod build', { status: 200 });
    }

    // ✅ Guard clause for req.json
    if (!req || typeof req.json !== 'function') {
      return new NextResponse('Build-time noop', { status: 200 });
    }

    const body = await req.json();
    const { id, email_addresses, first_name, image_url } = body?.data;
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

    return new NextResponse('User updated in database successfully', {
      status: 200,
    });

  } catch (error) {
    console.error('❌ Error updating database:', error);
    return new NextResponse('Error updating user in database', { status: 500 });
  }
}
