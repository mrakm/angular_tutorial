export class AttachedFileModel {
  /**
   * it will set the labels for attributes of Level of Education
   */
  static attributesLabels = {
    fileMeta: 'File Name',
    fileName: 'Name',
    filePath: 'Path',
    fileSize: 'Size',
    fileType: 'Type',
    title: 'Title',
    createdAt: 'Upload Date',
    createdBy: 'Uploaded By',
    description: 'Description'
  };

  id?: number;
  attachmentId: number;
  fileMeta: string;
  name: string;
  path: string;
  size: number;
  type: string;
  description: string;
  title: string;
  createdBy?: number;
  updatedBy?: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor() {}
}
