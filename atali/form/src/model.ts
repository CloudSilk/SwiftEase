import { BaseModel } from "@swiftease/atali-pkg";

export interface Form extends BaseModel {
  pageName:string
  group:string
  name: string
  schema: string
  description: string
}