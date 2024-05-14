import { Metadata } from './metadata'

import { BaseModel } from './common'

export interface Page extends BaseModel {
    metadataID: string
    pageSize: number
    editable: string
    showIndex: boolean
    toolBar: PageToolBar
    fields: PageField[]
    metadata: Metadata
    name: string
    enable: boolean
    path: string
    title?: string
    description?: string
    searchDefaultValue?: string
    editFormID?: string
    addFormID?: string
    viewFormID?: string
    searchFormID?: string
    type: number
    submitBefore?: string
    submitAfter?: string
    loadDetailBefore?: string
    loadDetailAfter?: string
    queryBefore?: string
    queryAfter?: string
    listAvatarField: string
    listTitleField: string
    listDescriptionField: string
    listContentField: string
    listLoadType: number
    cardAvatarField: string
    cardTitleField: string
    cardDescriptionField: string
    cardContentField: string
    cardImageField: string
    cardLoadType: number
    buttons?: PageButton[],
    bordered?: boolean
}

export interface PageButton {
    id: string
    pageID: string
    key: string
    label: string
    expanded: boolean
    showType: string
    href: string
    hrefFunc: string
    index: number,
    script: string
}

export interface PageField extends BaseModel {
    pageID: string
    name: string
    title: string
    copyable: boolean
    ellipsis: boolean
    rowKey: boolean
    form: FormFieldSchema
    sort?: number
    showInTable: boolean
    valueEnum: string
    component: string
    componentProps: string
    dataType?: string
    labelField?: string
    valueField?: string
}

export interface PageToolBar extends BaseModel {
    pageID: string
    fullScreen: boolean
    reload: boolean
    setting: boolean
    render: string
    showAdd: boolean
    addScript?: string
    showExport?: boolean
}

export interface FormFieldSchema extends BaseModel {
    pageFieldID: string
    name: string
    title: string
    type: string
    component: string
    componentProps: string
    required: boolean
    default: string
    search: boolean
    edit: boolean
    add: boolean
    readOnly: boolean
    dataSource: string
    dataSourceType: number
    labelField: string
    valueField: string
    searchComponent: string
}