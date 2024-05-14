
import { Metadata } from './metadata'
import { Template } from './template'
import { BaseModel } from "./common";

export interface Service extends BaseModel {
    name: string
    codeFiles: CodeFile[]
}

export const defaultService: Service = {
    name: '',
    codeFiles: [],
}

export interface CodeFile extends BaseModel {
    serviceID: string
    name: string
    dir: string
    codeFileDetails: CodeFileDetail[]
    start?: string
    end?: string
    code?: string,
    templateContent?: string,
}
export interface CodeFileDetail extends BaseModel {
    codeFileID: string
    templateID: string
    metadataID: string
    start?: string
    metadata?: Metadata
    template?: Template
    end?: string
    index:number
}