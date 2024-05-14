import { BaseModel } from "./common";

export interface Form extends BaseModel {
  name: string
  pageName:string
  group:string
  schema: string
  tenantID:string
  description: string
  versions:FormVersion[]
}

export interface FormVersion extends BaseModel{
  version:string
  formID:string
  schema:string
  description:string
}