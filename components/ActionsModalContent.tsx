import { Models } from 'node-appwrite';
import React from 'react';
import Thumbnail from './Thumbnail';

export const ImageThumbnail = ({ file }: { file: Models.Document }) => {
  return (
    <div className="file-details-thumbnail">
      <Thumbnail type={file.type} extension={file.extension} url={file.url} />
    </div>
  );
};

export const FileDetails = ({ file }: { file: Models.Document }) => {
  return (
    <>
      <ImageThumbnail file={file} />
    </>
  );
};

export const DeleteFile = ({ file }: { file: Models.Document }) => {
  return <div>DeleteFile</div>;
};

export const ShareFile = ({ file }: { file: Models.Document }) => {
  return <div>ShareFile</div>;
};
