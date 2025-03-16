import { comments } from '$lib/db/schema';
import { db } from '$lib/drizzle';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';

export const actions: Actions = {
  default: async ({
    request,
    locals: {
      session: { data: sessionData },
    },
  }) => {
    const formData = await request.formData();
    const content = formData.get('comment')?.toString() ?? '';

    const user = await db.query.users.findFirst({
      where: ({ id }, { eq }) => eq(id, sessionData.userId ?? ''),
    });

    if (!user) {
      return;
    }

    await db.insert(comments).values({ content, user_id: user.id });
  },
};

export const load: PageServerLoad = async () => {
  return {
    comments: await db.query.comments.findMany({
      with: {
        owner: true,
      },
    }),
    // comments: []
  };
};
