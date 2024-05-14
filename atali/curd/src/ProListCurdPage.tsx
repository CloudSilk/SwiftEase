
import { PageContainer } from '@ant-design/pro-layout';
import { PageInfo, QueryResponse } from '@swiftease/atali-pkg';
import SearchComponent from './components/Search';
import { CurdPage, CurdPageProps, CurdPageState } from './CurdPage';
import ProList from '@ant-design/pro-list'
import { ProCoreActionType } from '@ant-design/pro-utils';
import { Table } from 'antd';
import { Key } from 'react';
export interface ProListCurdPageProps extends CurdPageProps {
    rowClick?: (data: any) => void
}

export interface ProListCurdPageState extends PageInfo, CurdPageState {
    data: any[]
    expandedRowKeys: readonly Key[]
}

export class ProListCurdPage extends CurdPage<ProListCurdPageProps, ProListCurdPageState> {
    constructor(props: any) {
        super(props);
        this.setState({
            data: [],
            pages: 0,
            pageSize: 10,
            pageIndex: 1,
            records: 0,
            total: 0,
            current: 1,
        })
    }

    async load(self: any, isReset?: boolean) {

        let resp: QueryResponse<any> | null | undefined;
        let queryData: any = {}
        if (self.state.pageConfig.path !== "") {
            queryData = { ...self.state.searchForm?.values, }
        } else {
            queryData = {
                data: { ...self.state.searchForm?.values },
                pageName: self.state.pageConfig?.name
            }
        }
        eval(self.state.pageConfig?.queryBefore ?? '')
        queryData.current = self.state.current
        queryData.pageSize = self.state.pageConfig?.pageSize
        queryData.pageIndex = self.state.current
        resp = await self.state.service?.query(queryData)
        if (resp?.code == 20000) {
            self.setState({
                data: resp.data ?? [],
                pages: resp.pages,
                records: resp.records
            })
            eval(self.state.pageConfig?.queryAfter ?? '')
        }
    }

    getName() {
        return "ProListCurdPage"
    }

    showTotal(total: number, range: [number, number]) {
        return `第 ${range[0] ?? 0}-${range[1] ?? 0} 条/总共 ${total} 条`
    }

    renderActions(dom: React.ReactNode, entity: any, index: number, action: ProCoreActionType | undefined, schema: any): React.ReactNode {
        return <></>
    }
    setExpandedRowKeys(expandedKeys: readonly Key[]) {
        this.setState({ expandedRowKeys: expandedKeys })
    }

    createMetas() {
        let metas = {
            actions: {
                cardActionProps: this.state.pageConfig?.['proListShowType'] === 2 ? this.state.pageConfig['proListCardActionProps'] : undefined,
                render: (dom: any, entity: any, index: any, action: any, schema: any) => {
                    return this.createActions(entity)
                }
            }
        }
        if (this.state.pageConfig?.proListShowTitle) {
            metas['title'] = this.createMeta(this, 'proListTitleDataIndex', 'proListTitleValueType', 'proListTitleRender')
        }
        if (this.state.pageConfig?.proListShowSubTitle) {
            metas['subTitle'] = this.createMeta(this, 'proListSubTitleDataIndex', 'proListSubTitleValueType', 'proListSubTitleRender')
        }
        if (this.state.pageConfig?.proListShowMetaType) {
            metas['type'] = this.createMeta(this, 'proListTypeDataIndex', 'proListTypeValueType', 'proListTypeRender')
        }
        if (this.state.pageConfig?.proListShowContent) {
            metas['content'] = this.createMeta(this, 'proListContentDataIndex', 'proListContentValueType', 'proListContentRender')
        }
        if (this.state.pageConfig?.proListShowAvatar) {
            metas['avatar'] = this.createMeta(this, 'proListAvatarDataIndex', 'proListAvatarValueType', 'proListAvatarRender')
        }
        if (this.state.pageConfig?.proListShowMetaExtra) {
            metas['extra'] = this.createMeta(this, 'proListExtraDataIndex', 'proListExtraValueType', 'proListExtraRender')
        }
        return metas
    }
    createMeta(self: any, dataIndexField: string, valueTypeField: string, renderField: string) {
        return {
            dataIndex: self.state.pageConfig[dataIndexField],
            valueType: self.state.pageConfig[valueTypeField],
            render: self.state.pageConfig[renderField] && self.state.pageConfig[renderField] !== '' ? (dom: any, entity: any, index: any) => {
                let fn = new Function('curdPage', 'record', 'dataIndex', self.state.pageConfig?.[renderField])
                return fn(self, entity, self.state.pageConfig?.[dataIndexField])
            } : undefined
        }
    }
    render() {
        if (!this.state?.pageConfig) return (<></>)
        return (
            <PageContainer content={this.props.showTitle ? this.state.pageConfig?.description : undefined}
            token={{
                paddingBlockPageContainerContent: 0,
                paddingInlinePageContainerContent: 0
            }}
            title={this.props.showTitle ? this.state.pageConfig?.title : false} className={this.props.className}>
                <ProList<any>
                    ghost={this.state.pageConfig['proListGhost']}
                    // @ts-ignore
                    pagination={this.getPagination(this)}
                    // @ts-ignore
                    showActions={this.state.pageConfig['proListShowActions']}
                    // @ts-ignore
                    showExtra={this.state.pageConfig['proListShowExtra']}
                    rowSelection={this.state.pageConfig?.toolBar['rowSelection'] ? ({
                        selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
                        defaultSelectedRowKeys: [],
                        onChange: (selectedRowKeys: any, selectedRows: any) => {
                            this.setState({
                                ...this.state,
                                selectedIds: selectedRowKeys
                            })
                        }
                    }) : undefined}
                    grid={this.state.pageConfig['proListShowType'] == 2 ? { gutter: this.state.pageConfig['listGridTypeGutter'], column: this.state.pageConfig['listGridTypeColumn'] } : undefined}
                    onItem={(record: any, index: number) => {
                        return {
                            onMouseEnter: () => {
                                if (this.state.pageConfig?.proListItemMouseEnter && this.state.pageConfig.proListItemMouseEnter !== '') {
                                    let fn = new Function('curdPage', 'record', 'dataIndex', this.state.pageConfig['proListItemMouseEnter'])
                                    fn(this, record, index)
                                }
                            },
                            onClick: () => {
                                if (this.state.pageConfig?.proListItemClick && this.state.pageConfig.proListItemClick !== '') {
                                    let fn = new Function('curdPage', 'record', 'dataIndex', this.state.pageConfig['proListItemClick'])
                                    fn(this, record, index)
                                }
                            },
                        };
                    }}
                    // @ts-ignore
                    metas={this.createMetas()}
                    headerTitle={<SearchComponent
                        createSchemaField={this.props.createSchemaField}
                        updateSearchHeight={(height:any)=>{
                            this.updateSearchHeight(height)
                        }}
                        onReset={() => {
                            this.load(this, true)
                        }}
                        onSubmit={() => {
                            this.load(this)
                        }}
                        searchForm={this.state.searchForm}
                        searchFormSchema={this.state.searchFormSchema}
                        pageConfig={this.state.pageConfig}
                        searchFunc={() => {
                            if (this.props.actionRef?.current?.reset) {
                                this.props.actionRef.current?.reset()
                            }
                            this.load(this);
                        }}
                        formResetFunc={() => {
                            this.state.searchForm?.reset().then(() => {
                                this.setState({
                                    current: 0,
                                    total: 0,
                                    pageIndex: 0,
                                    pages: 0
                                })
                                if (this.props.actionRef?.current?.reset) {
                                    this.props.actionRef.current?.reset()
                                }
                                this.load(this, true)
                            })
                        }}
                    ></SearchComponent>}
                    dataSource={this.state.data}
                    toolBarRender={(action, rows) => {
                        return this.toolBarRender(this, action, rows)
                    }}
                    // @ts-ignore
                    itemLayout={this.state.pageConfig.listItemLayout}
                    expandable={this.state.pageConfig.listExpandable ? { expandedRowKeys: this.state.expandedRowKeys, onExpandedRowsChange: (expandedKeys) => this.setExpandedRowKeys(expandedKeys) } : undefined}
                    rowKey="id"
                    onRow={(item: any) => {
                        return {
                          onMouseDown: () => {
                            if (this.props.rowClick) {
                                this.props.rowClick(item)
                            }
                            
                          },
                        };
                      }}
                />
            </PageContainer>
        );
    }
}