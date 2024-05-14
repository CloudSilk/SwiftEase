import { PageContainer } from '@ant-design/pro-layout';
import { Avatar, Card, List } from 'antd';
import SearchComponent from './components/Search';
import Meta from 'antd/lib/card/Meta';
import { ListCurdPage } from './ListCurdPage';

export class CardCurdPage extends ListCurdPage {
    constructor(props: any) {
        super(props);
    }
    getName() {
        return "CardCurdPage"
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
                <div>
                    <SearchComponent
                        createSchemaField={this.props.createSchemaField}
                        updateSearchHeight={(height: any) => {
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
                </div>
                <List
                    grid={{ gutter: 10, column: 4, xs: 1, sm: 1, md: 2, lg: 4, xl: 4, xxl: 4 }}
                    dataSource={this.state.data}
                    pagination={{...this.getPagination(this)}}
                    style={{ height: document.body.offsetHeight-(this.state.searchHeight??0) - 140, overflowY: "scroll",  padding: 10,margin:10 }}
                    renderItem={item => (
                        <List.Item>
                            <Card
                                cover={
                                    this.state.pageConfig?.cardImageField && <img
                                        alt="example"
                                        src={item[this.state.pageConfig?.cardImageField ?? '']}
                                    />
                                }
                                actions={this.createActions(item)}
                            >
                                <Meta
                                    avatar={<Avatar src={item[this.state.pageConfig?.cardAvatarField ?? '']} />}
                                    title={item[this.state.pageConfig?.cardTitleField ?? '']}
                                    description={<div style={{
                                        display: '-webkit-box',
                                        'WebkitBoxOrient': 'vertical',
                                        'WebkitLineClamp': 4,
                                        height:88,
                                        overflow: 'hidden'
                                    }} title={item[this.state.pageConfig?.cardDescriptionField ?? '']}>{item[this.state.pageConfig?.cardDescriptionField ?? '']}</div>}
                                />
                            </Card></List.Item>
                    )}
                ></List>
            </PageContainer>
        );
    }
}