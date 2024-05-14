

import { BaseModel } from './common'

export interface Metadata extends BaseModel {
    code: string
    description: string
    displayName: string
    level: number
    name: string
    parentID: string
    purpose: string
    metadataFields?:MetadataField[]
}

export interface MetadataField extends BaseModel {
    comment: string
    component: string
    displayName: string
    isArray: boolean
    length: number
    metadataID: string
    name: string
    notNull: boolean
    refMetadata: string
    showInEdit: boolean
    showInTable: boolean
    type: string
    value?:string
    label?:string
}