import { PageContainer } from '@ant-design/pro-layout';
import { QueryResponse } from '@swiftease/atali-pkg';
import { Avatar, List, Skeleton } from 'antd';
import { Button } from 'antd';
import SearchComponent from './components/Search';
import { CurdPage, CurdPageProps, CurdPageState } from './CurdPage';
import { PlusOutlined } from '@ant-design/icons';
export interface ListCurdPageProps extends CurdPageProps {

}

export interface ListCurdPageState extends CurdPageState {
    data: any[]
}

export class ListCurdPage extends CurdPage<ListCurdPageProps, ListCurdPageState> {
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

    async load(self:any,isReset?: boolean) {

        let resp: QueryResponse<any> | null | undefined;
        let queryData: any = {}
        if (self.state.pageConfig?.path !== "" && !isReset) {
            queryData = {
                ...self.state.searchForm?.values
            }

        } else if (self.state.pageConfig?.path === "") {
            if (!isReset) {
                queryData = {
                    data: { ...self.state.searchForm?.values },
                    ...self.state.searchForm?.values,
                    pageName: self.state.pageConfig?.name,
                }
            } else {
                queryData = {
                    pageName: self.state.pageConfig?.name,
                }
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
        return "ListCurdPage"
    }

    getCustomerAction() {
        return <div>
            <Button key="add" type="primary" onClick={
                () => this.showAdd(this)
            }>新增</Button>
            <Button key="query" onClick={() => {
                this.load(this)
            }} type="primary">
                查询
            </Button>,
            <Button key="reset" onClick={() => {
                this.state.searchForm?.reset().then(() => {
                    this.load(this,true)
                })
            }} type="primary">
                重置
            </Button>
            {this.state.pageConfig?.toolBar['showExport'] &&
                <Button key="button" icon={<PlusOutlined />} onClick={() => {
                    this.exportTable({ ...this.state.searchForm.values })
                }} type="primary">
                    导出
                </Button>
            }
        </div>
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
                <List
                    dataSource={this.state.data}
                    pagination={this.getPagination(this)}
                    header={
                        <SearchComponent
                            createSchemaField={this.props.createSchemaField}
                            updateSearchHeight={(height:any)=>{
                                this.updateSearchHeight(height)
                            }}
                            onReset={() => {
                                this.load(this,true)
                            }}
                            onSubmit={() => {
                                this.load(this)
                            }}
                            searchForm={this.state.searchForm}
                            searchFormSchema={this.state.searchFormSchema}
                            pageConfig={this.state.pageConfig}
                            customerAction={this.getCustomerAction()}
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
                        ></SearchComponent>
                    }
                    rowKey={this.state.pageConfig?.listKeyField}
                    renderItem={item => (
                        <List.Item
                            actions={this.createActions(item)}
                        >
                            <Skeleton avatar title={false} loading={item.loading} active>
                                <List.Item.Meta
                                    avatar={
                                        this.state.pageConfig?.listAvatarField && <Avatar src={item[this.state.pageConfig?.listAvatarField ?? '']} />
                                    }
                                    title={item[this.state.pageConfig?.listTitleField ?? '']}
                                    description={item[this.state.pageConfig?.listDescriptionField ?? '']}
                                />
                                <div>{item[this.state.pageConfig?.listContentField ?? '']}</div>
                            </Skeleton>
                        </List.Item>
                    )}
                ></List>
            </PageContainer>
        );
    }
}