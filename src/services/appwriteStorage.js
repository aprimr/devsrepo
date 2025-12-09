import { storage } from "../appwrite/config";
import { ID, Permission, Role } from "appwrite";

const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID;

// Upload file
export const uploadFile = async (file) => {
  return await storage.createFile({
    bucketId,
    fileId: ID.unique(),
    file,
    permissions: [Permission.read(Role.any())],
  });
};

// Get download URL
export const getFileURL = (fileId) => {
  return storage.getFileView({ bucketId, fileId });
};

// Delete file
export const deleteFile = async (fileId) => {
  await storage.deleteFile({ bucketId, fileId });
};
