
export interface Process {
    id: string
    name: string
    versionTag: string
    isExecutable: boolean
    taskPriority?: number
    jobPriority?: number
    //可以启动流程的组织,为空时表示所有组织,多个以逗号隔开
    candidateStarterGroups?: string
    //可以启动流程的用户,为空时表示所有用户，多个以逗号隔开
    candidateStarterUsers?: string
    historyTimeToLive?: number
    startable: boolean
    documentation?: string
    listeners?: Listener[]
    properties?: Property[]
    cells?: ProcessCell[]
    messages?: GlobalMessage[]
    signals?: GlobalMessage[]
    errors: GlobalError[]
    escalations: GlobalError[]
}

export interface Listener extends Script {
    //start or end
    eventType: string
    listenerType: string
    javaClass: string
    expression: string
    delegateExpression: string
    fields: FieldInjection[]
}

export interface GlobalMessage {
    id: string
    name: string
}

export interface GlobalError {
    id: string
    name: string
    code: string
    message: string
}

export interface FieldInjection {
    name: string
    type: string
    value: string
}

export interface Property {
    name: string
    value: string
}

export interface Implementation {
    //external
    type: string
    topic: string
    taskPriority: number

    //java class
    class: string

    //expression
    expression: string
    resultVariable: string

    //delegate Expression
    delegateExpression: string
}

export interface Connector {
    connectorId: string
    inputParameter: Parameter[]
    outputParameter: Parameter[]
}

export interface Parameter extends Script {
    name: string
    //1-String or express
    //2-Script
    //3-List
    //4-Map
    type: string
    value: string
    list: string[]
    map: Map<string, string>
}

export interface Script {
    scriptFormat: string
    scriptType: string
    script: string
    resource: string
}

export const defaultProcess: Process = {
    id: '',
    name: "请假流程",
    versionTag: "1.0",
    isExecutable: true,
    startable: true,
    errors: [],
    escalations: []
}

export interface ProcessCell extends Shape {
    id?: string
    name: string
    data: CellData
    children?:string
    collapsed: boolean
}

export interface CellData extends Task, UserTask {
    id?:string
    asyncBefore: boolean
    asyncAfter: boolean
    exclusive: boolean
    documentation: string
    formKey: string
    jobPriority: number
    retryTimeCycle: number
    initiator: string
    inputs: Parameter[]
    outputs: Parameter[]
    listeners?: Listener[]
    properties?: Property[]
}

export interface BaseCell {

}

export interface Event extends Implementation {
    initiator: string
    messageEventDefinition: GlobalMessage
    extensionElements: FieldInjection[]
}

export interface Task {
    jobPriority: number
    retryTimeCycle: number
}

export interface UserTask {
    assignee: string
    candidateUsers: string
    candidateGroups: string
    dueDate: string
    followUpDate: string
    priority: number
}

export interface Shape {
    order: number
    name: string
    shape?: string
    zIndex?: number
    position: Position
    size?: Size
    source: any
    target: any
    x: number
    y: number
    sourceCell: string
    sourceSelector: string
    targetCell: string
    targetSelector: string
    width: number
    height: number
    children?: string
    parentID?: string
    originPositionX: number
    originPositionY: number
    originSizeWidth: number
    originSizeHeight: number
    visible: boolean
    markup: string
    attrs: string
}

export interface Position {

}

export interface Size {
    width: number
    height: number
}