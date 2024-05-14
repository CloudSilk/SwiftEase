import { PageContainer } from '@ant-design/pro-layout';
import { CurdPage, CurdPageProps, CurdPageState } from './CurdPage';
import {  ProColumns } from '@ant-design/pro-components';
import { Page } from './model';
import { BaseTreeModel, CommonService } from '@swiftease/atali-pkg';
import { Form as FormilyForm } from '@formily/core/esm/models'
import { TableCurdPage } from './TableCurdPage';
import { Col, Row } from 'antd';

export interface SplitCurdPageProps extends CurdPageProps {
	columns?: Array<ProColumns<Page>>;
	rowKey?: string;
}

export interface SplitCurdPageState extends CurdPageState {
	data: any[],
	responsive: boolean, // 分栏上下
	title: '', // 页面标题
	service?: CommonService<BaseTreeModel<any>>;
	editForm?: FormilyForm<any>;
	pageName?: string;
	isAdd?: boolean;
	expandedKeys?: any[];
	searchValue?: string;
	autoExpandParent?: boolean;
	detailData?: any;
}

export class SplitCurdPage extends CurdPage<SplitCurdPageProps, SplitCurdPageState> {
	constructor(props: any) {
		super(props);
		
	}

	componentDidMount(): Promise<void> {
		this.setState({
			responsive: false,
			autoExpandParent: true,
			expandedKeys: [],
		});
		return Promise.resolve();
	}

	async load(self: any, isReset?: boolean) {
				self.props.actionRef?.current?.reload();
		}

		getName() {
			return "SplitCurdPage"
		}


		onExpand = (expandedKeys: any) => {
			this.setState({
				expandedKeys,
				autoExpandParent: false,
			});
		};

		filterTreeNode = (node: any) => {
			if (this.state.searchValue === "") return false
			const title = node.title;
			const result = title.indexOf(this.state.searchValue) !== -1 ? true : false;
			return result;
		};

		render() {
			if (!this.state?.pageConfig) return (<></>)

			return (
				<PageContainer content={undefined} title={false} breadcrumb={undefined} 
				token={{
					paddingBlockPageContainerContent: 0,
					paddingInlinePageContainerContent: 0
				}}
				className={this.props.className}>
					
						<Row style={{background: 'white'}}>
							<Col span={14} >
								<TableCurdPage createSchemaField={this.props.createSchemaField} pageName={this.props.pageName} actionRef={this.props.actionRef} rowClick={(data) => {
									console.log('data: ', data);
									this.setState({...this.state, ...{
										detailData: data
									}});
								}}></TableCurdPage>
							</Col>
							<Col span={10}>
							<TableCurdPage createSchemaField={this.props.createSchemaField} pageName={this.state.pageConfig.pages}
								actionRef={this.props.actionRef} fromParentData={this.state.detailData}></TableCurdPage>
							</Col>
						</Row>
						{/* <ProCard
						// title={this.state.pageConfig?.title || "左右分栏带标题"}
						// extra="2019年9月28日"
						split={this.state.responsive ? 'horizontal' : 'vertical'}
						bordered
						headerBordered
					>
						<ProCard colSpan="60%">
							
							<TableCurdPage createSchemaField={this.props.createSchemaField} pageName={this.props.pageName} actionRef={this.props.actionRef} rowClick={(data) => {
								console.log('data: ', data);
								this.setState({...this.state, ...{
									detailData: data
								}});
							}}></TableCurdPage>
						</ProCard>
						<ProCard colSpan="40%">
							<TableCurdPage createSchemaField={this.props.createSchemaField} pageName={this.state.pageConfig.pages}
								actionRef={this.props.actionRef} fromParentData={this.state.detailData}></TableCurdPage>
								
						</ProCard>
					</ProCard> */}
					{/* <SplitPartComponent props={Object.assign({}, this.props, this.state, {
								onExpand: this.onExpand,
								filterTreeNode: this.filterTreeNode,
								componentType: this.state.pageConfig?.leftComponentType,
								load: this.load.bind(this)
							})}></SplitPartComponent> */}
							{/* 此时还拿不到子页面的type */}
							{/* <SplitPartComponent createSchemaField={this.props.createSchemaField} pageName={this.props.pageName} type={this.state.pageConfig.type} actionRef={this.props.actionRef} fromParentData={this.state.detailData}></SplitPartComponent> */}
				</PageContainer>
			);
		}
	}