import { ID, databases, storage } from "@/appwrite";

const uploadImage = async (file: File) => {
  if (!file) return;
  const bucketId = process.env.NEXT_PUBLIC_BUCKET_ID;
  if (!bucketId) {
    throw new Error("Bucket ID is not defined in environment variables");
  }

  const fileUploaded = await storage.createFile(bucketId, ID.unique(), file);
  return fileUploaded;
};

export default uploadImage;
