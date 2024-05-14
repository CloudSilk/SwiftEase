export interface ImageToolData {
    caption: string;
    withBorder: boolean;
    withBackground: boolean;
    stretched: boolean;
    file: {
        url: string;
    };
}

export interface ImageConfig {
    endpoints: {
        byFile: string;
        byUrl: string;
    };
    field?: string;
    types?: string;
    captionPlaceholder?: string;
    additionalRequestData?: object;
    additionalRequestHeaders?: object;
    buttonContent?: string;
    uploader?: {
        uploadByFile?: (file: File) => Promise<UploadResponseFormat>;
        uploadByUrl?: (url: string) => Promise<UploadResponseFormat>;
    };
    actions?: Array<any>;
}

export interface UploadResponseFormat {
    success: number;
    file: {
        url: string;
    };
}