export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const preferredRegion = 'auto';

import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// ✅ Skip webhook execution during Vercel static builds
export async function POST(req: Request) {
  if (process.env.VERCEL === '1' && process.env.NEXT_PUBLIC_SKIP_WEBHOOK_BUILD === 'true') {
    return new NextResponse('🔁 Skipping webhook during Vercel build', { status: 200 });
  }

  try {
    const body = await req.json();
    const { id, email_addresses, first_name, image_url } = body?.data || {};
    const email = email_addresses?.[0]?.email_address;

    if (!id || !email) {
      return new NextResponse('❗ Missing required user data', { status: 400 });
    }

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

    return new NextResponse('✅ User updated in database successfully', {
      status: 200,
    });
  } catch (error) {
    console.error('❌ Error updating database:', error);
    return new NextResponse('❌ Error updating user in database', {
      status: 500,
    });
  }
}
