import { currentUser } from '@clerk/nextjs/server';
import { type HandleUploadBody, handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export const POST = async (request: Request): Promise<NextResponse> => {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (
        pathname
        /* clientPayload */
      ) => {
        const user = await currentUser();

        if (!user) {
          throw new Error('Unauthorized');
        }

        return {
          allowedContentTypes: ['image/*', 'audio/*', 'video/*'],
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            userId: user.id,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Get notified of client upload completion
        // ⚠️ This will not work on `localhost` websites,
        // Use ngrok or similar to get the full upload flow
        console.log('blob upload completed', blob, tokenPayload);

        try {
          const { userId } = JSON.parse(tokenPayload ?? '{}');

          if (!userId) {
            throw new Error('User ID not found');
          }

          // Run any logic after the file upload completed
          // const { userId } = JSON.parse(tokenPayload);
          // await db.update({ avatar: blob.url, userId });
          await Promise.resolve();
        } catch (error) {
          throw new Error('Could not update user');
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The webhook will retry 5 times waiting for a 200
    );
  }
};
