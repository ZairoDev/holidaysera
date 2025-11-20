import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import axios from 'axios';

const generateRandomString = (length: number): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const uploadRouter = router({
  uploadImages: publicProcedure
    .input(
      z.object({
        folderName: z.string().describe('Folder name for storing images'),
        imageCount: z.number().int().min(1).describe('Number of images being uploaded'),
      })
    )
    .mutation(async ({ input }) => {
      // This mutation validates the input and returns presigned URLs for client-side upload
      // The actual file upload happens on the client side using the bunnyUpload hook
      
      try {
        const storageZoneName = process.env.NEXT_PUBLIC_BUNNY_STORAGE_ZONE;
        const accessKey = process.env.NEXT_PUBLIC_BUNNY_ACCESS_KEY;

        if (!storageZoneName || !accessKey) {
          throw new Error('Bunny CDN configuration is missing');
        }

        return {
          success: true,
          folderName: input.folderName,
          storageZoneName,
          accessKey,
          cdnUrl: 'https://vacationsaga.b-cdn.net',
        };
      } catch (error) {
        console.error('Upload validation error:', error);
        throw new Error('Failed to validate upload configuration');
      }
    }),

  uploadImage: publicProcedure
    .input(
      z.object({
        fileName: z.string().describe('File name of the image'),
        folderName: z.string().describe('Folder name for storing the image'),
        fileType: z.enum(['image/jpeg', 'image/png', 'image/webp']).describe('MIME type of the file'),
        fileData: z.string().describe('Base64 encoded file data'),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const storageZoneName = process.env.NEXT_PUBLIC_BUNNY_STORAGE_ZONE;
        const accessKey = process.env.NEXT_PUBLIC_BUNNY_ACCESS_KEY;
        const storageUrl = process.env.NEXT_PUBLIC_BUNNY_STORAGE_URL;

        if (!storageZoneName || !accessKey || !storageUrl) {
          throw new Error('Bunny CDN configuration is missing');
        }

        // Convert base64 to buffer
        const fileBuffer = Buffer.from(input.fileData, 'base64');

        const randomNumberToAddInImageName = generateRandomString(7);
        const finalFileName = `${randomNumberToAddInImageName}${input.fileName}`;

        // Upload to Bunny CDN
        const response = await axios.put(
          `${storageUrl}/${storageZoneName}/${input.folderName}/${finalFileName}`,
          fileBuffer,
          {
            headers: {
              AccessKey: accessKey,
              'Content-Type': input.fileType,
            },
          }
        );

        if (response.status === 201 || response.status === 200) {
          const imageUrl = `https://vacationsaga.b-cdn.net/${input.folderName}/${finalFileName}`;
          return {
            success: true,
            imageUrl,
            fileName: finalFileName,
          };
        }

        throw new Error('Failed to upload image to Bunny CDN');
      } catch (error) {
        console.error('Image upload error:', error);
        throw new Error('Failed to upload image');
      }
    }),

  deleteImage: publicProcedure
    .input(
      z.object({
        fileName: z.string().describe('File name to delete'),
        folderName: z.string().describe('Folder name where the file is stored'),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const storageZoneName = process.env.NEXT_PUBLIC_BUNNY_STORAGE_ZONE;
        const accessKey = process.env.NEXT_PUBLIC_BUNNY_ACCESS_KEY;
        const storageUrl = process.env.NEXT_PUBLIC_BUNNY_STORAGE_URL;

        if (!storageZoneName || !accessKey || !storageUrl) {
          throw new Error('Bunny CDN configuration is missing');
        }

        const response = await axios.delete(
          `${storageUrl}/${storageZoneName}/${input.folderName}/${input.fileName}`,
          {
            headers: {
              AccessKey: accessKey,
            },
          }
        );

        return {
          success: true,
          message: 'Image deleted successfully',
        };
      } catch (error) {
        console.error('Image deletion error:', error);
        throw new Error('Failed to delete image');
      }
    }),
});

// Reusable helper: delete a Bunny CDN image by full CDN URL
export async function deleteBunnyImageByUrl(url: string) {
  if (!url) return { success: false, message: 'invalid_url' };

  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return { success: false, message: 'invalid_url' };
    const fileName = parts.pop()!;
    const folderName = parts.join('/');

    const storageZoneName = process.env.NEXT_PUBLIC_BUNNY_STORAGE_ZONE;
    const accessKey = process.env.NEXT_PUBLIC_BUNNY_ACCESS_KEY;
    const storageUrl = process.env.NEXT_PUBLIC_BUNNY_STORAGE_URL;

    if (!storageZoneName || !accessKey || !storageUrl) {
      console.warn('Bunny CDN config missing, skip deletion');
      return { success: false, message: 'config_missing' };
    }

    await axios.delete(`${storageUrl}/${storageZoneName}/${folderName}/${fileName}`, {
      headers: { AccessKey: accessKey },
    });

    return { success: true };
  } catch (err) {
    console.error('deleteBunnyImageByUrl error', err);
    return { success: false, message: 'delete_failed' };
  }
}
