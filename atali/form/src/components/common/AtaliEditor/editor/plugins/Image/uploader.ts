//@ts-nocheck
import ajax from '@codexteam/ajax';

interface ImageConfig {
  endpoints: {
    byFile: string;
    byUrl: string;
  };
  uploader?: {
    uploadByFile?: (file: File) => Promise<any>;
    uploadByUrl?: (url: string) => Promise<any>;
  };
  types: string;
  field: string;
  additionalRequestData?: { [key: string]: any };
  additionalRequestHeaders?: { [key: string]: string };
}

type UploaderParams = {
  config: ImageConfig;
  onUpload: (response: any) => void;
  onError: (error: any) => void;
};

export default class Uploader {
  private config: ImageConfig;
  private onUpload: (response: any) => void;
  private onError: (error: any) => void;

  constructor({ config, onUpload, onError }: UploaderParams) {
    this.config = config;
    this.onUpload = onUpload;
    this.onError = onError;
  }

  uploadSelectedFile({ onPreview }: { onPreview: (dataUrl: string) => void }): void {
    const preparePreview = function (file: File) {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = (e: ProgressEvent<FileReader>) => {
        onPreview(e.target?.result as string);
      };
    };

    let upload: Promise<any>;

    if (this.config.uploader && typeof this.config.uploader.uploadByFile === 'function') {
      upload = ajax.selectFiles({ accept: this.config.types }).then((files: File[]) => {
        preparePreview(files[0]);

        return this.config.uploader?.uploadByFile?.(files[0]);
      });
    } else {
      upload = ajax.transport({
        url: this.config.endpoints.byFile,
        data: this.config.additionalRequestData,
        accept: this.config.types,
        headers: this.config.additionalRequestHeaders,
        beforeSend: (files: File[]) => {
          preparePreview(files[0]);
        },
        fieldName: this.config.field,
      }).then((response: { body: any; }) => response.body);
    }

    upload.then(this.onUpload).catch(this.onError);
  }

  uploadByUrl(url: string): void {
    let upload: Promise<any>;

    if (this.config.uploader && typeof this.config.uploader.uploadByUrl === 'function') {
      upload = this.config.uploader.uploadByUrl(url);
    } else {
      upload = ajax.post({
        url: this.config.endpoints.byUrl,
        data: Object.assign({ url: url }, this.config.additionalRequestData),
        type: ajax.contentType.JSON,
        headers: this.config.additionalRequestHeaders,
      }).then((response: { body: any; }) => response.body);
    }

    upload.then(this.onUpload).catch(this.onError);
  }

  uploadByFile(file: File, { onPreview }: { onPreview: (dataUrl: string) => void }): void {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = (e: ProgressEvent<FileReader>) => {
      onPreview(e.target?.result as string);
    };

    let upload: Promise<any>;

    if (this.config.uploader && typeof this.config.uploader.uploadByFile === 'function') {
      upload = this.config.uploader.uploadByFile(file);
    } else {
      const formData = new FormData();

      formData.append(this.config.field, file);

      if (this.config.additionalRequestData) {
        Object.entries(this.config.additionalRequestData).forEach(([name, value]) => {
          formData.append(name, value);
        });
      }

      upload = ajax.post
      ({
        url: this.config.endpoints.byFile,
        data: formData,
        type: ajax.contentType.JSON,
        headers: this.config.additionalRequestHeaders,
      }).then((response: { body: any; }) => response.body);
    }
    
    upload.then(this.onUpload).catch(this.onError);
  }
}    