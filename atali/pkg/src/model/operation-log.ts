import { BaseModel } from "./common";

export interface OperationRecord extends BaseModel {
    ip: string
    method: string
    uri: string
    status: number
    latency: number
    agent?: string
    errorMessage: string
    body: string
    resp: string
    userID?: string
    userName: string
}
