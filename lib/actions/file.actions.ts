'use server';

import {
  DeleteFileProps,
  FileType,
  GetFilesProps,
  RenameFileProps,
  UpdateFileUsersProps,
  UploadFileProps,
} from '@/types';
import { createAdminClient } from '../appwrite';
import { InputFile } from 'node-appwrite/file';
import { appwriteConfig } from '../appwrite/config';
import { ID, Models, Query } from 'node-appwrite';
import { constructFileUrl, getFileType, parseStringify } from '../utils';
import { getCurrentUser, handleError } from './user.actions';
import { revalidatePath } from 'next/cache';

export const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path,
}: UploadFileProps) => {
  const { storage, databases } = await createAdminClient();

  try {
    const inputFile = InputFile.fromBuffer(file, file.name);

    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile
    );

    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id,
    };

    const newFile = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      ID.unique(),
      fileDocument
    );
    return newFile;
  } catch (error) {
    handleError(error, 'Failed to upload file');
  }
};

function createQueries(
  currentUser: Models.Document,
  types: string[],
  searchText: string,
  sort: string,
  limit?: number
) {
  try {
    const queries = [
      Query.or([
        Query.equal('owner', [currentUser.$id]),
        Query.contains('users', [currentUser.email]),
      ]),
    ];

    if (types.length > 0) queries.push(Query.equal('type', types));

    return queries;
  } catch (error) {
    console.log(error);
  }
}

export const getFiles = async ({
  types = [],
  searchText = '',
  sort = '$createdAt-desc',
  limit,
  documents,
}: GetFilesProps) => {
  const { databases } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error('User not found');

    const queries = createQueries(currentUser, types, searchText, sort, limit);

    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      queries
    );
    console.log({ files });

    return parseStringify(files);
  } catch (error) {
    handleError(error, 'Failed to get files');
    return { total: 0, documents: [] };
  }
};

export const renameFile = async ({
  fileId,
  name,
  extension,
  path,
}: RenameFileProps) => {
  const { databases } = await createAdminClient();

  try {
    const newName = `${name}.${extension}`;
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        name: newName,
      }
    );
    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, 'Failed to rename the file');
  }
};

export const deleteFile = async ({
  fileId,
  bucketFileId,
  path,
}: DeleteFileProps) => {
  const { databases, storage } = await createAdminClient();

  try {
    const deletedFile = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId
    );

    if (deletedFile) {
      await storage.deleteFile(appwriteConfig.bucketId, bucketFileId);
    }
    revalidatePath(path);
    return parseStringify('success');
  } catch (error) {
    handleError(error, 'Failed to rename the file');
  }
};

export const updateFileUsers = async ({
  fileId,
  emails,
  path,
}: UpdateFileUsersProps) => {
  const { databases } = await createAdminClient();

  try {
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        users: emails,
      }
    );
    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, 'Failed to rename the file');
  }
};

export async function getTotalSpaceUsed() {
  try {
    const { databases } = await createAdminClient();
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error('User not found');

    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      [Query.equal('owner', [currentUser.$id])]
    );

    const totalSpace = {
      image: { size: 0, latestDate: '' },
      document: { size: 0, latestDate: '' },
      video: { size: 0, latestDate: '' },
      audio: { size: 0, latestDate: '' },
      other: { size: 0, latestDate: '' },
      used: 0,
      all: 2 * 1024 * 1024 * 1024,
    };
    files.documents.forEach((file) => {
      const fileType = file.type as FileType;
      totalSpace[fileType].size += file.size;
      totalSpace.used += file.size;

      if (
        !totalSpace[fileType].latestDate ||
        new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate)
      ) {
        totalSpace[fileType].latestDate = file.$updatedAt;
      }
    });

    return parseStringify(totalSpace);
  } catch (error) {
    handleError(error, 'Failed to get total space used');
  }
}
