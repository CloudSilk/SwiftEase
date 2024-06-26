import { PageContainer } from '@ant-design/pro-layout';
import { BaseTreeModel, Page, CommonService, RecursiveCall, GetDetailResponse } from '@swiftease/atali-pkg';
import { defaultCache, funcs, newService } from '@swiftease/atali-form'
import { FormButtonGroup, Reset, Submit } from '@swiftease/formily-antd-v5'
import { createForm } from '@formily/core'

import { Form as FormilyForm } from '@formily/core/esm/models';
import { Col, Input, Modal, Row, Tree } from 'antd';
import { Form } from '@swiftease/formily-antd-v5'
import { Form as FormData } from '@swiftease/atali-pkg'
import { Button } from 'antd/lib/radio';
import { MyIcon } from '@swiftease/atali-form'
import { CurdPage, CurdPageProps, CurdPageState } from './CurdPage';
import './index.less';
import { EditorLayout } from '@ant-design/pro-editor';
export interface TreeCurdPageProps extends CurdPageProps {
    showTitle?: boolean
    className?: string
    rowClick?: (data: any) => void
    // 新增是弹框显示表单
    addInDialog?: boolean
}

export interface TreeCurdPageState extends CurdPageState {
    service?: CommonService<BaseTreeModel<any>>;
    editForm?: FormilyForm<any>;
    formService?: CommonService<FormData>;
    pageName?: string;
    data: any[]
    isAdd: boolean
    expandedKeys: any[]
    searchValue: string
    autoExpandParent: boolean
}

export class TreeCurdPage extends CurdPage<TreeCurdPageProps, TreeCurdPageState> {
    constructor(props: any) {
        super(props);
        // @ts-ignore
        this.state = {
            formService: newService<FormData>('form'),
            data: [],
            isAdd: true,
            autoExpandParent: true,
            expandedKeys: [],
            searchValue: ''
        };
    }

    async load(self: any, isReset?: boolean | undefined) {
        const searchValues = {}
        eval(this.state.pageConfig?.queryBefore ?? '')
        this.state.service?.tree(searchValues).then((resp) => {
            if (resp?.code == 20000) {
                RecursiveCall(resp.data, (t) => {
                    let idField = this.state.pageConfig?.valueField ?? 'id'
                    let labelField = this.state.pageConfig?.labelField ?? 'name'
                    if (idField === '') idField = 'id'
                    if (labelField === '') labelField = 'name'

                    t['key'] = t[idField]
                    t['value'] = t[idField]
                    t['lable'] = t[labelField]
                    t['title'] = t[labelField] as string
                })
                const expandedKeys = []
                if (resp.data?.length > 0) {
                    expandedKeys.push(resp.data[0].id)
                }
                eval(this.state.pageConfig?.queryAfter ?? '')
                this.setState({ data: resp.data ?? [], expandedKeys: expandedKeys })
            }
        })
    }
    async rebuild() {
        const pageConfig = await this.state.formService?.get<GetDetailResponse<Page>>("/api/curd/page/detail/name", { name: this.props.pageName });
        if (pageConfig?.code !== 20000 || !pageConfig.data) return;

        let editFormSchema = {
            type: 'object',
            properties: {},
        };


        if (pageConfig.data.editFormID && pageConfig.data.editFormID != "") {
            const resp = await defaultCache.getFormConfig(pageConfig.data.editFormID)
            if (resp?.code == 20000) {
                const schema = JSON.parse(resp.data.schema);
                editFormSchema = schema.schema
            }
        }

        let addFormSchema = {
            type: 'object',
            properties: {},
        };
        if (pageConfig.data.addFormID && pageConfig.data.addFormID !== "") {
            const resp = await defaultCache.getFormConfig(pageConfig.data.addFormID)
            if (resp?.code == 20000) {
                const schema = JSON.parse(resp.data.schema);
                addFormSchema = schema.schema
            }
        }

        let initialValue = {}
        const addDefaultValue = pageConfig?.data?.["addDefaultValue"]
        if (addDefaultValue && addDefaultValue !== "") {
            initialValue = JSON.parse(addDefaultValue)
        }
        const self = this;
        this.setState({
            // @ts-ignore
            pageConfig: pageConfig?.data,
            editFormSchema: editFormSchema,
            addFormSchema: addFormSchema,
            service: newService<any>(pageConfig.data.path != "" ? pageConfig.data.path : "curd/common/" + pageConfig.data.name),
            pageName: this.props.pageName,
            editForm: createForm({
                initialValues: { id: "", ...initialValue }
            }),
        }, () => {
            self.load(self)
        });

    }

    async componentDidMount() {
        await this.rebuild()
    }

    async componentDidUpdate() {
        if (this.state.pageName == this.props.pageName) return

        await this.rebuild()
    }

    onChange(e: any, owner: TreeCurdPage) {
        const { value } = e.target;
        this.setState({
            searchValue: value,
        });
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
    getName() {
        return "TreeCurdPage"
    }
    createToolBarBtn() {
        const customeBtns: any[] = [];
        this.state.pageConfig?.buttons?.forEach(btn => {
            if (btn.showPosition != 2 || !btn.enable) return
            let func: Function | null = null
            if (btn.script && btn.script !== '') {
                func = new Function('curdPage', 'history', 'btnConfig', btn.script)
            }
            customeBtns.push(<Button key="button" onClick={() => {
                if (func) func(this, history, btn)
            }} type="primary">
                {btn.label}
            </Button>)
        })
        return customeBtns
    }
    createEditBtn(self: TreeCurdPage) {
        const customeBtns: any[] = [];
        self.state.pageConfig?.buttons?.forEach(btn => {
            if (btn.showPosition != 1 || !btn.enable) return
            let func: Function | null = null
            if (btn.script && btn.script !== '') {
                func = new Function('curdPage', 'record', 'history', 'btnConfig', btn.script)
            }
            customeBtns.push(<Button key="button" onClick={() => {
                if (func) func(self, self.state.editForm?.values, history, btn)
            }} type="primary">
                {btn.label}
            </Button>)
        })
        return customeBtns
    }
    calcTableHeight() {
        var h = document.body.offsetHeight - 107
        return h
    }
    render() {
        if (!this.state?.pageConfig) return (<></>)
        const customeBtns = this.createToolBarBtn()
        return (
            <PageContainer content={undefined} title={this.props.showTitle ? this.state.pageConfig?.title : false}
                token={{
                    paddingBlockPageContainerContent: 0,
                    paddingInlinePageContainerContent: 0
                }}
                breadcrumb={undefined} className={this.props.className}>
                <EditorLayout
                    style={{
                        maxWidth: '100%',
                        height: this.calcTableHeight(),
                    }}
                    header={{
                        iconConfig: false,
                        children: <Row style={{ width: "100%" }}>
                            <Col span={4}  style={{ marginRight: 5 }}><Input.Search size='large' placeholder="查询" onChange={e => this.onChange(e, this)} /></Col>
                            <Col>
                                <Button onClick={() => {
                                    if (this.props.addInDialog)
                                        this.showAdd(this)
                                    else {
                                        this.setState({ isAdd: true })
                                        let initialValue = {}
                                        const addDefaultValue = this.state.pageConfig?.["addDefaultValue"]
                                        if (addDefaultValue && addDefaultValue !== "") {
                                            initialValue = JSON.parse(addDefaultValue)
                                        }
                                        this.state.editForm?.setValues(initialValue, "overwrite")
                                        this.state.editForm?.reset()
                                    }

                                }}>新增</Button>
                                {this.state.pageConfig?.toolBar['showExport'] && <Button onClick={() => {
                                    this.exportTable({ ids: this.state.selectedIds });
                                }}>导出</Button>}
                                {this.state.pageConfig?.toolBar['showImport'] && <Button onClick={() => {
                                    this.showImportDialog(this);
                                }}>导入</Button>}
                                {customeBtns}
                            </Col></Row>
                    }}
                    footer={false}
                    bottomPannel={false}
                    rightPannel={false}
                    leftPannel={{
                        style:{
                            height: this.calcTableHeight()-40,
                            overflowY: "auto"
                        },
                        children: <Tree treeData={this.state.data} key={'id'}
                            expandedKeys={this.state.expandedKeys}
                            autoExpandParent={this.state.autoExpandParent}
                            onExpand={this.onExpand}
                            showLine={true}
                            filterTreeNode={this.filterTreeNode}
                            titleRender={(node) => {
                                return <span>{node.icon && <MyIcon type={node.icon}></MyIcon>}{node.title}</span>
                            }}
                            onSelect={(selectedKeys, { selected, selectedNodes, node, event }) => {
                                this.state.service?.detail(node['id']).then(resp => {
                                    if (resp?.code == 20000) {
                                        eval(this.state.pageConfig?.loadDetailAfter ?? '')
                                        this.state.editForm?.setValues(resp?.data, "overwrite")
                                        this.setState({ isAdd: false })
                                        if (this.props.rowClick) {
                                            this.props.rowClick(resp?.data)
                                        }
                                    }
                                })

                            }}></Tree>,
                    }}
                    centerPannel={{
                        style:{
                            height: this.calcTableHeight()-40,
                            overflowY: "auto"
                        },
                        children:<div><Form labelCol={6} wrapperCol={12} form={this.state?.editForm}>
                        {this.props.createSchemaField && this.props.createSchemaField(this.state?.editFormSchema, {
                            ...funcs, reloadSon: () => {
                                this.state.service?.detail(this.state.editForm?.values['id']).then(resp => {
                                    if (resp?.code == 20000) {
                                        eval(this.state.pageConfig?.loadDetailAfter ?? '')
                                        this.state.editForm?.setValues(resp?.data, "overwrite")
                                        this.setState({ isAdd: false })
                                        if (this.props.rowClick) {
                                            this.props.rowClick(resp?.data)
                                        }
                                    }
                                    this.load(this);
                                })
                            }
                        }, false)}
                        {/* @ts-ignore */}
                        <FormButtonGroup.FormItem align={'right'}>
                            {!this.props.addInDialog && <Submit onSubmit={(values) => {
                                eval(this.state.pageConfig?.submitBefore ?? '')
                                if (this.state.isAdd) {
                                    this.state.service?.add(values).then((resp) => {
                                        if (resp?.code == 20000) {
                                            this.load(this);
                                            this.setState({ isAdd: true })
                                            this.state.editForm?.reset()
                                        }
                                    })
                                } else {
                                    this.state.service?.update(values).then((resp) => {
                                        if (resp?.code == 20000) {
                                            this.load(this);
                                            // this.setState({ isAdd: true })
                                            // this.state.editForm?.reset()
                                        } else {

                                        }

                                    })
                                }

                            }}>{this.state.isAdd ? '新增' : '保存'}</Submit>}
                            {!this.props.addInDialog && <Reset>重置</Reset>}
                            {!this.state.isAdd && !this.props.addInDialog && <Submit onSubmit={
                                (values) => {
                                    Modal.confirm({
                                        title: '确认删除',
                                        onOk: () => {
                                            this.state.service?.delete({ pageName: this.state.pageConfig?.name, id: values.id }).then((resp) => {
                                                if (resp?.code == 20000) {
                                                    this.load(this);
                                                    this.setState({ isAdd: true })
                                                    this.state.editForm?.reset()
                                                } else {

                                                }
                                            })
                                        }
                                    })
                                }
                            }>删除</Submit>}
                            {!this.state.isAdd && this.createEditBtn(this)}
                        </FormButtonGroup.FormItem>
                    </Form></div>
                    }}
                />
            </PageContainer>
        );
    }
}