import { BaseModel } from "./common"

export interface Cell extends BaseModel {
    markup: CellMarkup[]
    mustSource: boolean
    height: number
    connectings: CellConnecting[]
    name: string
    system: string
    defaultLabel: string
    view: string
    index: number
    tenantID: string
    icon: string
    propertyForm: string
    height2: number
    attrs: CellAttrs[]
    idPrefix: string
    iconSource: number
    shape: string
    width2: number
    isEdge: boolean
    common: boolean
    parent: boolean
    resizing: boolean
    group: string
    mustTarget: boolean
    width: number
    defaultEdge: boolean
    other: string
    defaultLabelAttrs: string
    ports: string
    formDefaultValue: string
}

export interface CellConnecting extends BaseModel {
    cellID: string
    edge: string
    anotherCell: string
    direct: number
}

export interface CellAttrs extends BaseModel {
    stroke: string
    fontSize: number
    other: string
    textAnchor: string
    name: string
    fill: string
    ref: string
    magnet: boolean
    textVerticalAnchor: string
    cellID: string
    selectedFill: string
    selectedStroke: string
    isDefaultLabel: boolean
    linkHref: string
}

export interface CellMarkup extends BaseModel {
    textContent: string
    cellID: string
    other: string
    children: string
    className: string
    selector: string
    groupSelector: string
    tagName: string
    attrs: string
    style: string
    index: number
    isDefaultLabel: boolean
}