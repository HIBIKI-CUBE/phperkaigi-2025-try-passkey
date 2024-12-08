import type { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/types';
import type { RequestHandler } from './$types';
import { users } from '$lib/db/schema';
import { db } from '$lib/drizzle';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { error, json } from '@sveltejs/kit';
import { PUBLIC_RP_ID, PUBLIC_RP_NAME } from '$env/static/public';

export const POST: RequestHandler = async ({ request, locals: { session } }) => {
  const body: { username?: string } = await request.json();
  const userName = body.username;
  if (!userName)
    return error(400, 'Parameter missing');
  const [user] = await db.insert(users).values({ name: userName }).returning();

  const options: PublicKeyCredentialCreationOptionsJSON = await generateRegistrationOptions({
    rpName: PUBLIC_RP_NAME,
    rpID: PUBLIC_RP_ID,
    userName,
    userID: new TextEncoder().encode(user.id),
    attestationType: 'none',
    // Prevent users from re-registering existing authenticators
    excludeCredentials: undefined, // TODO: Get existing credentials,
    // See "Guiding use of authenticators via authenticatorSelection" below
    authenticatorSelection: {
      residentKey: 'required',
      userVerification: 'preferred',
      authenticatorAttachment: 'platform',
    },
  });

  await session.regenerate();
  session.cookie.path = '/';
  await session.setData({
    userId: user.id,
    challenge: options.challenge,
  });
  await session.save();

  return json({ options });
};
