
import { PageContainer } from '@ant-design/pro-layout';
import { ProColumns } from '@ant-design/pro-table';
import { Page, PageField } from './model';
import SearchComponent from './components/Search/index'
import TableComponent from './components/Table/index'
import { Image, Tag } from 'antd';
import { CurdPage, CurdPageProps, CurdPageState } from './CurdPage';
import moment from 'moment';
import Icon from './components/Icon';
export interface TableCurdPageProps extends CurdPageProps {
    rowClick?: (data: any) => void
}

export interface TableCurdPageState extends CurdPageState {
    columns?: Array<ProColumns<Page>>;
    rowKey: string

}

export const indexProColumns: ProColumns = {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 52,
    title: '序号'
}

export function newProColumns(tableCurdPage: CurdPage<TableCurdPageProps, TableCurdPageState>, field: PageField) {
    const col = {
        title: field.title,
        dataIndex: field.name,
        copyable: field.copyable,
        ellipsis: field.ellipsis,
        fixed: field.fixed,
        search: false,
        width: field['width'],
    } as ProColumns;
    switch (field.dataType) {
        case 'Enum':
            if (field.name == 'enable') {
                col.valueEnum = {
                    false: { text: '禁用' },
                    true: { text: '启用' }
                }
            } else if (field.valueEnum != "") {
                const valueEnum = JSON.parse(field.valueEnum)
                if (valueEnum && valueEnum.forEach) {
                    const data: any = {}
                    valueEnum.forEach((obj: any) => {
                        data[obj.value] = { text: obj.label }
                    })
                    col.valueEnum = data
                }
            }
            break
        case 'Icon':
            col.render = (dom, entity) => {
                let iconUrl = entity[field.name]
                if (iconUrl && !iconUrl.startsWith("http")) {
                    iconUrl = (tableCurdPage.props.downloadFileUrlPrefix ?? "/api/core/file/download") + ("?id=" + entity[field.name])
                }
                return (
                    <Image
                        width={60} height={60}
                        src={iconUrl}
                    />
                )
            }
            break
        case 'Avatar':
            col.render = (dom, entity) => {
                let avatarUrl = entity[field.name]
                if (avatarUrl && !avatarUrl.startsWith("http")) {
                    avatarUrl = (tableCurdPage.props.downloadFileUrlPrefix ?? "/api/core/file/download") + ("?id=" + entity[field.name])
                }
                return (
                    <Image
                        width={60} height={60}
                        src={avatarUrl}
                    />
                )
            }
            break
        case "Status":
            let statusData: any[]
            if (field.valueEnum != "") {
                statusData = JSON.parse(field.valueEnum)
            } else {
                statusData = [{
                    "value": 0, "color": "success", "label": "成功"
                }, {
                    "value": 1, "color": "error", "label": "错误"
                }, {
                    "value": 2, "color": "warning", "label": "警告"
                }]
            }
            const getStatus = (status: number) => {
                let data: any = {}
                statusData.forEach((obj) => {
                    if (status == obj.value) {
                        data = obj
                        return false
                    }
                    return true
                })
                return data
            }
            col.render = (dom, entity) => {
                const status = getStatus(entity[field.name])
                return (
                    <Tag color={status["color"]}>{status["label"]}</Tag>
                )
            }
            break
        case "IconStatus":
            let iconStatusData: any[]
            if (field.valueEnum != "") {
                iconStatusData = JSON.parse(field.valueEnum)
            } else {
                iconStatusData = [{
                    "value": 0, "icon": "CloseOutlined", "color": "#ff000", "label": "错误"
                }, {
                    "value": 1, "icon": "CheckOutlined", "color": "#008000", "label": "成功"
                }, {
                    "value": 2, "icon": "WarningOutlined", "color": "#ffff00", "label": "警告"
                }]
            }
            const getIconStatus = (status: number) => {
                let data: any = {}
                iconStatusData.forEach((obj) => {
                    if (status == obj.value) {
                        data = obj
                        return false
                    }
                    return true
                })
                return data
            }
            col.render = (dom, entity) => {
                const status = getIconStatus(entity[field.name]) || {};
                return (
                    <Icon icon={status['icon'] || 'CloseOutlined'} iconProps={{
                        style: { color: (status['color'] || '#ff0000') }
                    }}></Icon>


                )
            }
            break;
        case "Script":
            let fn: any = undefined
            if (field.valueEnum != "") {
                fn = new Function('record', field.valueEnum)
            }
            col.render = (dom, entity) => {
                if (fn) {
                    return fn(entity)
                }
                return entity[field.name]
            }
            break
        case "TimeStamp":
            col.render = (dom, entity) => {
                if (entity.valueEnum !== "") {
                    return moment.unix(entity[field.name]).format(entity.valueEnum)
                }
                return moment.unix(entity[field.name]).format("YYYY-MM-DD HH:mm")
            }
            break;
        case "TimeStamp2":
            col.render = (dom, entity) => {
                if (entity.valueEnum !== "") {
                    return moment(entity[field.name]).format(entity.valueEnum)
                }
                return moment(entity[field.name]).format("YYYY-MM-DD HH:mm")
            }
            break;
    }
    return col
}

export class TableCurdPage extends CurdPage<TableCurdPageProps, TableCurdPageState> {
    constructor(props: any) {
        super(props);
    }

    async load(self: any, isReset?: boolean) {
        self.props.actionRef?.current?.reload()
    }

    getName() {
        return "TableCurdPage"
    }

    rebuildAfter() {
        const pageConfig = this.state.pageConfig
        if (!pageConfig) return
        const columns: ProColumns<any>[] = [];
        if (pageConfig?.showIndex) {
            columns.push(indexProColumns)
        }
        const tableCurdPage = this
        //对字段和按钮进行排序
        pageConfig?.fields?.sort((a, b) => a.sort - b.sort)
        pageConfig?.fields?.forEach((field) => {
            if (field.showInTable) {
                const col = newProColumns(tableCurdPage, field)
                if (field.enableSort) {
                    col.sorter = true
                }
                columns.push(col)
            }
        });

        if (pageConfig.buttons && pageConfig.buttons?.length > 0) {
            pageConfig.buttons.sort((a, b) => a.index - b.index)
            if (pageConfig.buttons.some(item => item.enable)) {
                columns.push({
                    title: '操作',
                    valueType: 'option',
                    fixed: "right",
                    width: 180,
                    render: (text, record, _, action) => {
                        return tableCurdPage.createCustomAction(tableCurdPage, pageConfig, record)
                    },
                });
            }


        } else if (this.props.createAction) {
            this.props.createAction(this, columns)
        } else {
            columns.push({
                title: '操作',
                valueType: 'option',
                width: 150,
                fixed: "right",
                render: (text, record, _, action) => {
                    return tableCurdPage.createAction(tableCurdPage, pageConfig, record)
                },
            });
        }
        tableCurdPage.setState({
            columns: columns,
            rowKey: 'id'
        })
    }

    render() {
        if (!this.state?.pageConfig) return (<></>)
        return (
            <PageContainer content={undefined} style={{ marginBottom: 0 }} token={{
                paddingBlockPageContainerContent: 0,
                paddingInlinePageContainerContent: 0
            }} title={false} breadcrumb={undefined} className={this.props.className}>
                {
                    (Object.keys(this.state.searchFormSchema?.properties).length ?
                        (<SearchComponent
                            createSchemaField={this.props.createSchemaField}
                            updateSearchHeight={(height: any) => {
                                this.updateSearchHeight(height)
                            }}
                            onReset={() => {
                                if (this.props.actionRef?.current?.reset) {
                                    this.props.actionRef.current?.reset()
                                }
                            }}
                            onSubmit={() => {
                                if (this.props.actionRef?.current?.reloadAndRest) {
                                    this.props.actionRef.current?.reloadAndRest()
                                }
                                
                            }}
                            searchForm={this.state.searchForm}
                            searchFormSchema={this.state.searchFormSchema}
                            pageConfig={this.state.pageConfig}
                            searchFunc={() => {
                                if (this.props.actionRef?.current?.reset) {
                                    this.props.actionRef.current?.reset()
                                }
                                this.load(this);
                                if(this.props.setSearchValuesState) {
                                    this.props.setSearchValuesState(this.state.searchForm?.values, this.state.pageConfig);
                                }
                                
                            }}
                            formResetFunc={() => {
                                const searchForm = this.state.searchForm;
                                if(this.props.setSearchValuesState) {
                                    this.props.setSearchValuesState(null, this.state.pageConfig);
                                }
                                // this.state.searchForm?.setInitialValues({});
                                searchForm?.reset().then(() => {
                                    searchForm.setInitialValues({}, 'overwrite');
                                    searchForm.setValues({}, 'overwrite');
                                    this.setState({
                                        current: 0,
                                        total: 0,
                                        pageIndex: 0,
                                        pages: 0,
                                        searchForm: searchForm,
                                    })
                                    console.log('this.state.searchForm: ', this.state.searchForm);
                                    
                                    if (this.props.actionRef?.current?.reset) {
                                        this.props.actionRef.current?.reset()
                                    }
                                    
                                    this.load(this, true)
                                })
                            }}
                        ></SearchComponent>) : null)
                }
                <TableComponent
                    isResizable={false}
                    searchHeight={this.state.searchHeight}
                    columns={this.state.columns}
                    rowKey={this.state.rowKey}
                    actionRef={this.props.actionRef}
                    service={this.state.service}
                    searchForm={this.state.searchForm}
                    pageConfig={this.state.pageConfig}
                    toolBarRender={(action, rows) => {
                        return this.toolBarRender(this, action, rows)
                    }}
                    enableSelection={this.state.pageConfig?.toolBar['rowSelection']}
                    onSelectedChange={(selectedRowKeys: any, selectedRows: any) => {
                        this.state.searchForm.setValues({ids:selectedRowKeys})
                    }}
                    showAdd={() => {
                        this.showAdd(this)
                    }}
                    getPagination={() => this.getPagination(this)}
                    rowClick={this.props.rowClick}
                    fromParentData={this.props.fromParentData}
                ></TableComponent>

            </PageContainer>
        );
    }
}