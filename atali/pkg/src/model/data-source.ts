import { BaseModel, BaseTreeModel } from './common'

export interface DataSource extends BaseTreeModel<DataSource> {
    dataSourceFields: DataSourceField[]
    description?: string
    type: string
    deviceNoSep?: string
}

export interface DataSourceField extends BaseModel {
    dataSourceID: string
    sourceField: string
    type: string
    destinationField: string
    convertFunc: string
    isDeviceNo: boolean
}