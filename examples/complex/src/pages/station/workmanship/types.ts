import { BaseModel } from '@swiftease/atali-pkg'

export interface Workmanship extends BaseModel {
    stationID: string
    name: string
    code: string
    description: string
    workmanshipSteps: WorkmanshipStep[]
}

export interface WorkmanshipStep extends BaseModel {
    order: number
    workmanshipID: string
    stationID?: string
    name: string
    shape?: string
    sourceCell: string
    targetCell: string
    sourceSelector: string
    targetSelector: string
    zIndex?: number
    x: number
    y: number
    width: number
    height: number
    children?: string
    parentID?: string
    data: WorkmanshipStepData
    originPositionX: number
    originPositionY: number
    originSizeWidth: number
    originSizeHeight: number
    visible: boolean
    markup: string
    attrs: string
    collapsed: boolean
}

export interface WorkmanshipStepData extends BaseModel {
    callActiviti: WorkmanshipStepCallActiviti
    workmanshipStepID: string
    stationID?: string
    workmanshipID:string
    code: string
    deviceType: string
    protocol: string
    cmd: string
    registerAddress: string
    length: number
    writeData: string
    dataType: number
    serialPortName: string
    ip: string
    port: number
    baudRate: number
    dataBits: number
    stopBits: number
    parityMode: number
    connectTimeout: number
    userName: string
    password: string
    registerType: number
    combineType: number
    combineStartBit: number
    combineEndBit: number
    minValue: number
    maxValue: number
    bytesOrder: number
    encode: number
    scale: number
    bias: number
    controlMethod: number
    levelCmd: boolean
    pulseWidth: number
    pulseFirstCmd: boolean
    pulseSecondCmd: boolean
    stringCmd: string
    nameIdentifier: string
}

export interface WorkmanshipStepCallActiviti extends BaseModel {
    workmanshipStepDataID: string
    name: string
    url: string
    protocol: string
    codeFieldName: string
    dataFieldName: string
    messageFieldName: string
    fields: WorkmanshipStepCallActivitiField[]
    httpMethod: string
    authorization: string
    description: string
}

export interface WorkmanshipStepCallActivitiField extends BaseModel {
    workmanshipStepCallActivitiID: string
    sourceFieldName: string
    targetFieldName: string
    sourceDataType: string
    targetDataType: string
    convertFn: string
}