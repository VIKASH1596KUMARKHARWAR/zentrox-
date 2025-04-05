export const runtime = 'nodejs';
<<<<<<< HEAD:src/app/api/clerk-webhook/route.ts
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const preferredRegion = 'auto';
=======
>>>>>>> 46efed3 (fix: deploy Clerk webhook route safely):src/app/api/clerk-webhook-fix/route.ts


import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
<<<<<<< HEAD:src/app/api/clerk-webhook/route.ts
  // ✅ Block webhook execution during static build phase on Vercel
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return new NextResponse('🛑 Skipping webhook during static build', { status: 200 });
=======
  // 👇 Prevent crash during build
  if (process.env.NODE_ENV === 'production' && !req?.headers) {
    return new NextResponse('Skip static build', { status: 200 });
>>>>>>> 46efed3 (fix: deploy Clerk webhook route safely):src/app/api/clerk-webhook-fix/route.ts
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

<<<<<<< HEAD:src/app/api/clerk-webhook/route.ts
    return new NextResponse('✅ User updated in database successfully', { status: 200 });
=======
    return new NextResponse('User updated in database successfully', {
      status: 200,
    });
>>>>>>> 46efed3 (fix: deploy Clerk webhook route safely):src/app/api/clerk-webhook-fix/route.ts
  } catch (error) {
    console.error('❌ Error updating database:', error);
    return new NextResponse('Error updating user in database', { status: 500 });
  }
}
