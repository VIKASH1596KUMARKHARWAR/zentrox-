export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const preferredRegion = 'auto';

import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // ✅ Block webhook execution during static build phase on Vercel
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return new NextResponse('🛑 Skipping webhook during static build', { status: 200 });
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

    return new NextResponse('User updated in database successfully', {
      status: 200,
    });
  } catch (error) {
    console.error('❌ Error updating database:', error);
    return new NextResponse('Error updating user in database', { status: 500 });
  }
}
